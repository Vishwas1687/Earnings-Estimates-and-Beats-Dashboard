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
      console.log("Fetching data for single ticker:", singleTicker);
      var ticker = singleTicker;
      var name = singleName;
      var filtered_data = [];
      var result = await getEPSEstimatesData(ticker);
      filtered_data = cleanEarningsEstimatesData(ticker, name, result);
      filtered_data.timestamp = Date.now();
      earningsEstimates = earningsEstimates.filter(
        (item) => item.ticker !== ticker
      );
      earningsEstimates.push(filtered_data);
      saveEarningsEstimates(earningsEstimates);
      return res.json({ filtered_data });
    }

    const watchlist = categories
      .find((cat) => cat.name === category)
      .watchlists.find((wl) => wl.name === watchlistName);
    var filtered_data = [];
    var result;

    console.log("Processing watchlist companies:", watchlist.companies);

    for (let i = 0; i < watchlist.companies.length; i++) {
      const company = watchlist.companies[i];
      var ticker = company.ticker;
      var name = company.name;

      if (!earningsEstimates.some((item) => item.ticker === ticker)) {
        console.log("No existing data found for ", ticker);
        result = await getEPSEstimatesData(ticker);
        const newCompanyData = cleanEarningsEstimatesData(ticker, name, result);
        newCompanyData.timestamp = Date.now();
        filtered_data.push(newCompanyData);
        earningsEstimates.push(newCompanyData);
      } else if (
        earningsEstimates.some(
          (item) =>
            item.ticker === ticker && item.timestamp < Date.now() - 86400000
        )
      ) {
        console.log(
          "Data is stale or not present, fetching new data for ",
          ticker
        );
        earningsEstimates = earningsEstimates.filter(
          (item) => item.ticker !== ticker
        );
        result = await getEPSEstimatesData(ticker);
        const updatedCompanyData = cleanEarningsEstimatesData(
          ticker,
          name,
          result
        );
        updatedCompanyData.timestamp = Date.now();
        filtered_data.push(updatedCompanyData);
        earningsEstimates.push(updatedCompanyData);
      } else {
        const existingData = earningsEstimates.find(
          (item) => item.ticker === ticker
        );
        filtered_data.push(existingData);
      }

      // Update price for the current company data
      const price = await getRealTimePrice(ticker);
      filtered_data[i].price = price;
    }
    saveEarningsEstimates(earningsEstimates);
    res.json({ filtered_data: filtered_data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
