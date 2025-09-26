import YahooFinance from "yahoo-finance2";
import {extractDate, getQuarterDate, getQuarterDifference} from './dateUtils.js';
import fs from "fs";

export const getEPSEstimatesData = async (ticker) => {
  const result = await YahooFinance.quoteSummary(ticker, {
    modules: [
      "assetProfile",
      "price",
      "earningsTrend",
      "defaultKeyStatistics",
      "financialData",
    ],
  });
  const mostRecentQuarter = extractDate(result.defaultKeyStatistics?.mostRecentQuarter);
  const lastFiscalYear = extractDate(result.defaultKeyStatistics?.lastFiscalYearEnd);
  const balance_sheet = await YahooFinance.fundamentalsTimeSeries(ticker, {
    period1: lastFiscalYear,
    period2: mostRecentQuarter,
    type: "quarterly",
    module: "balance-sheet",
  });
  const financials = await YahooFinance.fundamentalsTimeSeries(ticker, {
    period1: getQuarterDate(mostRecentQuarter, 4),
    period2: mostRecentQuarter,
    type: "quarterly",
    module: "financials",
  });
  const quarter_difference = getQuarterDifference(mostRecentQuarter, lastFiscalYear);
  var reserves = balance_sheet[0]?.stockholdersEquity;
  const length = financials.length;
  for(var i = length - 1; i >= length - 1 -quarter_difference ; i--)
  {
    reserves += financials[i]?.netIncome;
  }
  const roe = ( financials[0]?.netIncome + financials[1]?.netIncome + financials[2]?.netIncome + financials[3]?.netIncome ) /
               reserves;
  result.roe = (roe * 100).toFixed(2);
  result.mostRecentQuarter = mostRecentQuarter;
  result.lastFiscalYear = lastFiscalYear;
  result.reserves = reserves;
  result.lastFiscalReserves = balance_sheet[0]?.stockholdersEquity;
  result.shares = result?.defaultKeyStatistics?.sharesOutstanding;
  return result;
};

export const getRealTimePrice = async (ticker) => {
  const result = await YahooFinance.quoteSummary(ticker, {
    modules: ["price"],
  });
  return result.price?.regularMarketPrice;
};

export const loadEarningsEstimates = () => {
  try {
    const data = fs.readFileSync("./store/earnings_estimates.json", "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error(
      "Error reading earnings_estimates.json, initializing with empty array"
    );
    return [];
  }
};

export const saveEarningsEstimates = (data) => {
  try {
    fs.writeFileSync(
      "./store/earnings_estimates.json",
      JSON.stringify(data, null, 2)
    );
  } catch (err) {
    console.error("Error writing earnings_estimates.json:", err);
  }
};

const calculateEpsGrowthFields = (
  period_name,
  earningsTrend,
  price,
  TTM_EPS,
  market_cap,
  shares,
  reserves,
  lastFiscalReserves
) => {
  const current_quarter_year_ago_eps =
    earningsTrend[0].earningsEstimate?.yearAgoEps;
  const next_quarter_year_ago_eps =
    earningsTrend[1].earningsEstimate?.yearAgoEps;
  const year_ago_eps = earningsTrend[2].earningsEstimate?.yearAgoEps;

  const current_quarter_eps = earningsTrend[0].earningsEstimate?.avg;
  const next_quarter_eps = earningsTrend[1].earningsEstimate?.avg;
  const current_year_eps = earningsTrend[2].earningsEstimate?.avg;
  const next_year_eps = earningsTrend[3].earningsEstimate?.avg;

  var eps, eps_growth, pe, peg, roe_earnings, pb_fwd, pb_valuation, roe;
  var TTM_profit, reserves_estimates;
  const safeValue = (val) => ( (isNaN(val) || val === undefined || val == null ) ? 0 : val);
  if(safeValue(lastFiscalReserves) == 0){
    lastFiscalReserves = reserves;
  }
  if (period_name === "Current Quarter") {
    eps = TTM_EPS - current_quarter_year_ago_eps + current_quarter_eps;
    pe = price / eps;
    eps_growth =
      ((current_quarter_eps - current_quarter_year_ago_eps) /
        Math.abs(current_quarter_year_ago_eps)) *
      100;
    reserves_estimates = reserves + shares * safeValue(current_quarter_eps);
  } else if (period_name === "Next Quarter") {
    eps =
      TTM_EPS -
      current_quarter_year_ago_eps -
      next_quarter_year_ago_eps +
      current_quarter_eps +
      next_quarter_eps;
    pe = price / eps;
    eps_growth =
      ((next_quarter_eps - next_quarter_year_ago_eps) /
        Math.abs(next_quarter_year_ago_eps)) *
      100; 
    reserves_estimates = reserves + shares * (safeValue(current_quarter_eps) + safeValue(next_quarter_eps));
  } else if (period_name === "Current Year") {
    eps = current_year_eps;
    pe = price / current_year_eps;
    eps_growth =
      ((current_year_eps - year_ago_eps) / Math.abs(year_ago_eps)) * 100;
    reserves_estimates = lastFiscalReserves + safeValue(current_year_eps) * shares;
  } else if (period_name === "Next Year") {
    eps = next_year_eps;
    pe = price / eps;
    eps_growth =
      ((next_year_eps - current_year_eps) / Math.abs(current_year_eps)) * 100;
    reserves_estimates = lastFiscalReserves + shares * (safeValue(current_year_eps) + safeValue(next_year_eps));

  }
  peg = pe / eps_growth;
  TTM_profit = eps * shares;
  roe = (TTM_profit / reserves_estimates) * 100;
  pb_fwd = market_cap / reserves_estimates;
  roe_earnings = (roe * eps_growth) / 100;
  pb_valuation = pb_fwd / roe_earnings;
  return {
    eps_growth: eps_growth,
    pe: pe?.toFixed(2),
    peg: peg?.toFixed(2),
    roe_earnings: roe_earnings?.toFixed(2),
    pb_fwd: pb_fwd?.toFixed(2),
    pb_valuation: pb_valuation?.toFixed(2),
  };
};

const handleEarningsTrend = (earningsTrend, price, TTM_EPS, market_cap, shares, reserves, lastFiscalReserves) => {
  const quartersMap = {
    "0q": "Current Quarter",
    "+1q": "Next Quarter",
    "0y": "Current Year",
    "+1y": "Next Year",
  };
  var earningsObj = {};
  for (let i = 0; i < earningsTrend.length; i++) {
    const period = earningsTrend[i].period;
    const period_name = quartersMap[period]; // Current Quarter, Next Quarter, Current Year, Next Year
    const eps_estimates = earningsTrend[i].earningsEstimate?.avg;
    const eps_estimates_year_ago =
      earningsTrend[i].earningsEstimate?.yearAgoEps;
    const analystCount = earningsTrend[i].earningsEstimate?.numberOfAnalysts;
    const { eps_growth, pe, peg, roe_earnings, pb_fwd, pb_valuation } =
      calculateEpsGrowthFields(
        period_name,
        earningsTrend,
        price.regularMarketPrice,
        TTM_EPS,
        market_cap,
        shares,
        lastFiscalReserves
      );
    earningsObj[period_name] = {
      eps_estimate: eps_estimates,
      year_ago_eps: eps_estimates_year_ago,
      eps_growth: eps_growth?.toFixed(2),
      pe: pe,
      peg: peg,
      roe_earnings: roe_earnings,
      pb_fwd: pb_fwd,
      pb_valuation: pb_valuation,
      analystCount: analystCount,
    };
  }
  return earningsObj;
};

const handleRevenueTrend = (revenueTrend) => {
  const quartersMap = {
    "0q": "Current Quarter",
    "+1q": "Next Quarter",
    "0y": "Current Year",
    "+1y": "Next Year",
  };
  var revenueObj = {};
  for (let i = 0; i < revenueTrend.length; i++) {
    const period = revenueTrend[i].period;
    const period_name = quartersMap[period]; // Current Quarter, Next Quarter, Current Year, Next Year
    const revenue_estimates = revenueTrend[i].revenueEstimate?.avg;
    const revenue_estimates_year_ago =
      revenueTrend[i].revenueEstimate?.yearAgoRevenue;
    const revenue_growth =
      ((revenue_estimates - revenue_estimates_year_ago) /
        Math.abs(revenue_estimates_year_ago)) *
      100;
    const analystCount = revenueTrend[i].revenueEstimate?.numberOfAnalysts;

    revenueObj[period_name] = {
      revenue_growth: revenue_growth?.toFixed(2),
      analystCount: analystCount,
    };
  }
  return revenueObj;
};

export const cleanEarningsEstimatesData = (ticker, name, data) => {
  const currency = data.price?.currency;
  const price = data.price?.regularMarketPrice;
  const TTM_EPS = data.defaultKeyStatistics?.trailingEps;
  const TTM_PE = TTM_EPS ? (price / TTM_EPS).toFixed(2) : "N/A";
  const marketCap = data.price?.marketCap;
  const PriceToBook =
    data.defaultKeyStatistics?.priceToBook?.toFixed(2) || "N/A";
  const ROE = data.roe;
  const ROA = data.financialData?.returnOnAssets
    ? (data.financialData.returnOnAssets * 100).toFixed(2)
    : "N/A";
  const ebitdaMargins = data.financialData?.ebitdaMargins
    ? (data.financialData.ebitdaMargins * 100).toFixed(2)
    : "N/A";
  const operatingMargins = data.financialData?.operatingMargins
    ? (data.financialData.operatingMargins * 100).toFixed(2)
    : "N/A";
  const profitMargins = data.financialData?.profitMargins
    ? (data.financialData.profitMargins * 100).toFixed(2)
    : "N/A";
  const industry = data.assetProfile?.industryKey || "N/A";
  const sector = data.assetProfile?.sectorKey || "N/A";
  const earningsTrend = handleEarningsTrend(
    data?.earningsTrend?.trend,
    data?.price,
    TTM_EPS,
    marketCap,
    data?.shares,
    data?.reserves,
    data?.lastFiscalReserves

  );
  const revenueTrend = handleRevenueTrend(data?.earningsTrend?.trend);
  const country = currency === "USD" ? "US" : "INDIA";
  return {
    country: country,
    ticker: ticker,
    name: name,
    mostRecentQuarter: data.mostRecentQuarter,
    lastFiscalYear: data.lastFiscalYear,
    price: price,
    industry: industry,
    sector: sector,
    TTM_EPS: TTM_EPS?.toFixed(2),
    TTM_PE: TTM_PE,
    PB: PriceToBook,
    ROE: ROE,
    ROA: ROA,
    EBITDAMargins: ebitdaMargins,
    OPM: operatingMargins,
    NPM: profitMargins,
    earningsTrend: earningsTrend,
    revenueTrend: revenueTrend,
  };
};
