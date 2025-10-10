import { loadCategories, saveCategories } from "../util/categoryUtil.js";

export const fetchWatchlistController = (req, res) => {
  try {
    const watchlists = loadCategories();
    const { category } = req.params;
    const categoryObj = watchlists.find((cat) => cat.name === category);
    if (!categoryObj) {
      return res.status(404).json({ error: "Category not found" });
    } else {
      return res.json(categoryObj.watchlists);
    }
  } catch (error) {
    console.error("Error fetching watchlists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addWatchlistController = (req, res) => {
  try {
    const categories = loadCategories();
    const { category, watchlistName } = req.body;
    let categoryObj = categories.find((cat) => cat.name === category);
    if (!categoryObj) {
      return res.status(404).json({ error: "Category not found" });
    } else {
      const existingWatchlist = categoryObj.watchlists.find(
        (wl) => wl.name === watchlistName
      );
      if (existingWatchlist) {
        return res
          .status(400)
          .json({ error: "Watchlist already exists in this category" });
      } else {
        const newWatchlist = { name: watchlistName, companies: [], fields: [] };
        categoryObj.watchlists.push(newWatchlist);
        saveCategories(categories);
        return res.json(newWatchlist);
      }
    }
  } catch (error) {
    console.error("Error adding watchlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeWatchlistController = (req, res) => {
  try {
    const { category, watchlistName } = req.body;
    let categories = loadCategories();
    let categoryObj = categories.find((cat) => cat.name === category);
    if (!categoryObj) {
      return res.status(404).json({ error: "Category not found" });
    } else {
      const watchlist = categoryObj.watchlists.find(
        (wl) => wl.name === watchlistName
      );
      if (!watchlist) {
        return res
          .status(404)
          .json({ error: "Watchlist not found in this category" });
      } else {
        categoryObj.watchlists = categoryObj.watchlists.filter(
          (wl) => wl.name !== watchlistName
        );
        saveCategories(categories);
        return res.json({ message: "Watchlist removed successfully" });
      }
    }
  } catch (error) {
    console.error("Error removing watchlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addCompanyToWatchlistController = (req, res) => {
  try {
    const { category, watchlistName, company } = req.body;
    const categories = loadCategories();
    const categoryObj = categories.find((cat) => cat.name === category);
    if (!categoryObj) {
      return res.status(404).json({ error: "Category not found" });
    } else {
      const watchlist = categoryObj.watchlists.find(
        (wl) => wl.name === watchlistName
      );
      if (!watchlist) {
        return res
          .status(404)
          .json({ error: "Watchlist not found in this category" });
      } else {
        const existingCompany = watchlist.companies.find(
          (comp) => comp.ticker === company.ticker
        );
        if (existingCompany) {
          return res
            .status(400)
            .json({ error: "Company already exists in this watchlist" });
        } else {
          watchlist.companies.push(company);
          saveCategories(categories);
          return res.json(company);
        }
      }
    }
  } catch (error) {
    console.error("Error adding company to watchlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeCompanyFromWatchlistController = (req, res) => {
  try {
    const { category, watchlistName, ticker } = req.body;
    const categories = loadCategories();
    const categoryObj = categories.find((cat) => cat.name === category);
    if (!categoryObj) {
      return res.status(404).json({ error: "Category not found" });
    } else {
      const watchlist = categoryObj.watchlists.find(
        (wl) => wl.name === watchlistName
      );
      if (!watchlist) {
        return res
          .status(404)
          .json({ error: "Watchlist not found in this category" });
      } else {
        const company = watchlist.companies.find(
          (comp) => comp.ticker === ticker
        );
        if (!company) {
          return res
            .status(404)
            .json({ error: "Company not found in this watchlist" });
        } else {
          watchlist.companies = watchlist.companies.filter(
            (comp) => comp.ticker !== ticker
          );
          saveCategories(categories);
          return res.json({ message: "Company removed successfully" });
        }
      }
    }
  } catch (error) {
    console.error("Error removing company from watchlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateWatchlistFieldsController = (req, res) => {
  try {
    const { category, watchlistName, fields } = req.body;

    // Validate input parameters
    if (!category || !watchlistName || !fields) {
      console.log("Missing required parameters:", {
        category,
        watchlistName,
        fields,
      });
      return res.status(400).json({
        error:
          "Missing required parameters: category, watchlistName, and fields are required",
      });
    }

    const categories = loadCategories();
    const categoryObj = categories.find((cat) => cat.name === category);
    if (!categoryObj) {
      console.log("Category not found:", category);
      return res.status(404).json({ error: "Category not found" });
    }

    const watchlist = categoryObj.watchlists.find(
      (wl) => wl.name === watchlistName
    );
    if (!watchlist) {
      return res
        .status(404)
        .json({ error: "Watchlist not found in this category" });
    }
    // Update the fields
    watchlist.fields = fields;

    // Save the updated categories
    saveCategories(categories);
    return res.json({
      success: true,
      watchlist: watchlist,
      message: "Watchlist fields updated successfully",
    });
  } catch (error) {
    console.error("Error updating watchlist fields:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const fetchSingleWatchlistController = (req, res) => {
  try {
    const watchlists = loadCategories();
    const { category, watchlist } = req.params;
    const categoryObj = watchlists.find((cat) => cat.name === category);
    if (!categoryObj) {
      return res.status(404).json({ error: "Category not found" });
    }
    const watchlistObj = categoryObj.watchlists.find(
      (wl) => wl.name === watchlist
    );
    if (!watchlistObj) {
      return res.status(404).json({ error: "Watchlist not found" });
    }
    return res.json(watchlistObj);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
