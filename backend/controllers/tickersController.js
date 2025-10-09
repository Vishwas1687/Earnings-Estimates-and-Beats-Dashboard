import { loadTickers, saveTickers } from "../util/tickerUtils.js";
import { loadCategories, saveCategories } from "../util/categoryUtil.js";

export const tickersController = (req, res) => {
  try {
    const tickers = loadTickers();
    return res.json(tickers);
  } catch (error) {
    console.error("Error fetching tickers:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteCompanyController = (req, res) => {
  try {
    console.log("Delete company controller reached");
    const ticker = req.query.ticker;
    const category = req.query.category;
    const watchlistName = req.query.watchlist;
    let categories = loadCategories();
    console.log(category, ticker, watchlistName);
    let categoryObj = categories.find((cat) => cat.name === category);
    if (categoryObj) {
      console.log("Category found");
      let watchlistObj = categoryObj.watchlists.find(
        (wl) => wl.name === watchlistName
      );
      if (watchlistObj) {
        console.log("Watchlist found");
        // Check if companies array exists, if not create it
        if (!watchlistObj.companies) {
          watchlistObj.companies = [];
        }
        // Filter out the company with the matching ticker
        watchlistObj.companies = watchlistObj.companies.filter(
          (comp) => comp.ticker !== ticker
        );
        saveCategories(categories);
        console.log("Company removed successfully");
        return res.json({ success: true, watchlist: watchlistObj });
      }
    }
    return res.status(404).json({ error: "Category or watchlist not found" });
  } catch (error) {
    console.error("Error in deleting the company:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
