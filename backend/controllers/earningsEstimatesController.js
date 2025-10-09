import {
  loadEarningsEstimates,
  saveEarningsEstimates,
  getEPSEstimatesData,
  getRealTimePrice,
  cleanEarningsEstimatesData,
} from "../util/earningsEstimatesUtil.js";
import { loadCategories, saveCategories } from "../util/categoryUtil.js";

export const earningsEstimatesController = async (req, res) => {
  try {
    let earningsEstimates = loadEarningsEstimates();
    const categories = loadCategories();
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
    const category = categories.find((cat) => cat.name === req.query.category);
    if (!category) {
      return res.status(400).json({ error: "Invalid category" });
    }
    const watchlist = category.watchlists.find(
      (wl) => wl.name === req.query.watchlist
    );
    if (!watchlist) {
      return res.status(400).json({ error: "Invalid watchlist" });
    }
    if (!watchlist.companies) {
      watchlist.companies = [];
    }
    if (!watchlist.companies.some((item) => item.ticker === ticker)) {
      watchlist.companies.push({ ticker: ticker, name: name });
    }
    saveCategories(categories);
    res.json({ filtered_data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
