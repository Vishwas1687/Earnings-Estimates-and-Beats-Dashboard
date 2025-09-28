import {
  loadEarningsEstimates,
  saveEarningsEstimates,
  getEPSEstimatesData,
  getRealTimePrice,
  cleanEarningsEstimatesData,
} from "../util/earningsEstimatesUtil.js";
import { loadTickers, saveTickers } from "../util/tickerUtils.js";

export const earningsEstimatesController = async (req, res) => {
  try {
    let earningsEstimates = loadEarningsEstimates();
    let tickers = loadTickers();
    const ticker = req.query.ticker;
    const name = req.query.name;
    var filtered_data = {};
    var result;
    // Deduplication check
    if (!earningsEstimates.some((item) => item.ticker === ticker)) {
      result = await getEPSEstimatesData(ticker);
      filtered_data = cleanEarningsEstimatesData(ticker, name, result);
      filtered_data.timestamp = Date.now();
      earningsEstimates.push(filtered_data);
      if(!tickers.some((item)=>item.ticker === ticker)) {
        tickers.push({ ticker: ticker, name: name });
      } 
      saveTickers(tickers);
      saveEarningsEstimates(earningsEstimates);
    } else if (
      earningsEstimates.some((item) => item.ticker === ticker).timestamp <
      Date.now() - 86400000
    ) {
      earningsEstimates = earningsEstimates.filter(
        (item) => item.ticker !== ticker
      );
      result = await getEPSEstimatesData(ticker);
      filtered_data = cleanEarningsEstimatesData(ticker, name, result);
      filtered_data.timestamp = Date.now();
      earningsEstimates.push(filtered_data);
      saveEarningsEstimates(earningsEstimates);
    } else {
      const price = await getRealTimePrice(ticker);
      filtered_data = earningsEstimates.find((item) => item.ticker === ticker);
      filtered_data.price = price;
    }
    res.json({ filtered_data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
