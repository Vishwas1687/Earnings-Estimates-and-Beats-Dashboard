import fs from "fs";
import { loadEarningsEstimates } from "./earningsEstimatesUtil.js"; 
export const loadPriceTargets = () => {
  try{
    const data = fs.readFileSync("./store/price_targets.json", "utf-8");
    return data ? JSON.parse(data) : [];
  }catch(error){
    console.error("Failed to load price targets json file");
    return [];
  }
}

export const savePriceTargets = (data) => {
  try {
  fs.writeFileSync(
    "./store/price_targets.json",
    JSON.stringify(data, null, 2)
  );
  } catch (err) {
      console.error("Error writing tickers.json:", err);
      return [];
  }
}

export const calculatePriceTarget = (ticker, period, field, value) => {
  try{
    const stock_data = loadEarningsEstimates();
    const ticker_obj = stock_data.find((item)=>item.ticker === ticker);
    var targetPrice = 0;
    const eps = ticker_obj.earningsTrend[period].eps_estimate;
    if(field === "pb_fwd"){
      const shares = ticker_obj.shares;
      const lastFiscalReserves = ticker_obj.lastFiscalReserves;
      const next_year_reserves = lastFiscalReserves + eps * shares;
      targetPrice = ((value * next_year_reserves ) / shares).toFixed(2);
    } else if(field === "pe"){
      targetPrice = (eps * value).toFixed(2);
    }
    const priceChange = (((targetPrice - ticker_obj.price) / ticker_obj.price) * 100).toFixed(2);
    return {
      targetPrice,
      priceChange
    } 
   } catch (error){
    console.error(error);
    return 0;
  }
}