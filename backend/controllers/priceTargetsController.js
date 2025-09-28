import { calculatePriceTarget } from "../util/priceTargetUtils.js";
import { loadEarningsEstimates, saveEarningsEstimates } from "../util/earningsEstimatesUtil.js";

export const priceTargetsController = (req, res) => {
  try{
    const field = req.body.field;
    const period = req.body.period;
    const ticker = req.body.ticker;
    const value = Number(req.body.value);
    const stock_data = loadEarningsEstimates();
    var ticker_obj = stock_data.find((item)=>item.ticker === ticker);
    if (!('priceTarget' in ticker_obj)) {
      ticker_obj["priceTarget"] = {};
    }
    if (!(period in ticker_obj["priceTarget"])) {
      ticker_obj["priceTarget"][period] = {};
    }
    if (!(field in ticker_obj["priceTarget"][period])) {
      ticker_obj["priceTarget"][period][field] = {};
    }
    ticker_obj["priceTarget"][period][field]["Value"] = value;
    const {targetPrice, priceChange} = calculatePriceTarget(ticker, period, field, value);
    ticker_obj["priceTarget"][period][field]["priceTarget"] = targetPrice;
    ticker_obj["priceTarget"][period][field]["priceChange"] = priceChange;
    const updated_stock_data = stock_data.filter((item)=>item.ticker !== ticker);
    updated_stock_data.push(ticker_obj);
    saveEarningsEstimates(updated_stock_data);
    return res.json(ticker_obj);
  } catch(error) {
    console.error(error);
  }
}