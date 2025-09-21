import YahooFinance from "yahoo-finance2";
import fs from "fs";

export const getEPSEstimatesData = async (ticker) => {
  const result = await YahooFinance.quoteSummary(ticker, {
    modules: ["assetProfile", "price", "earningsTrend", "defaultKeyStatistics"],
  });
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

const calculateEpsGrowthPEAndPEG = (
  period_name,
  earningsTrend,
  price,
  TTM_EPS
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

  var eps, eps_growth, pe, peg;
  if (period_name === "Current Quarter") {
    eps = TTM_EPS - current_quarter_year_ago_eps + current_quarter_eps;
    pe = price / eps;
    eps_growth =
      ((current_quarter_eps - current_quarter_year_ago_eps) /
        Math.abs(current_quarter_year_ago_eps)) *
      100;
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
  } else if (period_name === "Current Year") {
    pe = price / current_year_eps;
    eps_growth =
      ((current_year_eps - year_ago_eps) / Math.abs(year_ago_eps)) * 100;
  } else if (period_name === "Next Year") {
    pe = price / next_year_eps;
    eps_growth =
      ((next_year_eps - current_year_eps) / Math.abs(current_year_eps)) * 100;
  }
  peg = pe / eps_growth;
  return { eps_growth: eps_growth, pe: pe?.toFixed(2), peg: peg?.toFixed(2) };
};

const handleEarningsTrend = (earningsTrend, price, TTM_EPS) => {
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
    const { eps_growth, pe, peg } = calculateEpsGrowthPEAndPEG(
      period_name,
      earningsTrend,
      price.regularMarketPrice,
      TTM_EPS
    );
    earningsObj[period_name] = {
      eps_estimate: eps_estimates,
      year_ago_eps: eps_estimates_year_ago,
      eps_growth: eps_growth?.toFixed(2),
      pe: pe,
      peg: peg,
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
  const industry = data.assetProfile?.industryKey || "N/A";
  const sector = data.assetProfile?.sectorKey || "N/A";
  const earningsTrend = handleEarningsTrend(
    data?.earningsTrend?.trend,
    data?.price,
    TTM_EPS
  );
  const revenueTrend = handleRevenueTrend(data?.earningsTrend?.trend);
  const country = currency === "USD" ? "US" : "INDIA";
  return {
    country: country,
    ticker: ticker,
    name: name,
    price: price,
    industry: industry,
    sector: sector,
    TTM_EPS: TTM_EPS?.toFixed(2),
    TTM_PE: TTM_PE,
    earningsTrend: earningsTrend,
    revenueTrend: revenueTrend,
  };
};
