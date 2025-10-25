import {
  loadEarningsEstimates,
  saveEarningsEstimates,
  getEPSEstimatesData,
  getRealTimePrice,
  cleanEarningsEstimatesData,
} from "../util/earningsEstimatesUtil.js";
import { loadCategories } from "../util/categoryUtil.js";

export const earningsEstimatesController = async (req, res) => {
  try {
    let earningsEstimates = loadEarningsEstimates();
    const categories = loadCategories();
    const category = req.query.category;
    const watchlistName = req.query.watchlist;
    const singleTicker = req.query.ticker;
    const singleName = req.query.name;
    const all = req.query.all;

    if (all === "false") {
      var ticker = singleTicker;
      var name = singleName;
      var filtered_data = [];
      result = await getEPSEstimatesData(ticker);
      filtered_data = cleanEarningsEstimatesData(ticker, name, result);
      filtered_data.timestamp = Date.now();
      earningsEstimates = earningsEstimates.filter(
        (item) => item.ticker !== ticker
      );
      earningsEstimates.push(filtered_data);
      saveEarningsEstimates(earningsEstimates);
      filtered_data.id = ticker;
      return res.json({ filtered_data });
    }

    const watchlist = categories
      .find((cat) => cat.name === category)
      .watchlists.find((wl) => wl.name === watchlistName);
    var filtered_data = [];
    var result;

    for (const company of watchlist.companies) {
      var i = 0;
      var ticker = company.ticker;
      var name = company.name;
      if (
        earningsEstimates.some((item) => item.ticker === ticker).timestamp <
        Date.now() - 86400000
      ) {
        earningsEstimates = earningsEstimates.filter(
          (item) => item.ticker !== ticker
        );
        result = await getEPSEstimatesData(ticker);
        filtered_data.push(cleanEarningsEstimatesData(ticker, name, result));
        filtered_data[i].timestamp = Date.now();
        earningsEstimates.push(filtered_data[i]);
        saveEarningsEstimates(earningsEstimates);
      } else {
        const existingData = earningsEstimates.find(
          (item) => item.ticker === ticker
        );
        filtered_data.push(existingData);
      }
      const price = await getRealTimePrice(ticker);
      filtered_data[i].price = price;
      filtered_data[i].id = ticker;
      i = i + 1;
    }
    res.json({ filtered_data: filtered_data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
