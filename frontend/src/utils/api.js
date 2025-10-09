// utils/api.js
const API_BASE_URL = "http://localhost:5000";

export const fetchEarningsData = async (ticker, name, category, watchlist) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/earnings-estimates?ticker=${encodeURIComponent(
        ticker
      )}&name=${encodeURIComponent(name)}&category=${encodeURIComponent(
        category
      )}&watchlist=${encodeURIComponent(watchlist)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
};

export const fetchTickers = async () => {
  // Example static list of tickers; replace with dynamic fetching if needed
  try {
    const response = await fetch(`${API_BASE_URL}/api/fetch-tickers`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
};

export const deleteStock = async (
  ticker,
  currentCategory,
  currentWatchlist
) => {
  try {
    console.log(currentCategory, currentWatchlist);
    const response = await fetch(
      `${API_BASE_URL}/api/delete-company?ticker=${encodeURIComponent(ticker)}&category=${encodeURIComponent(currentCategory)}&watchlist=${encodeURIComponent(currentWatchlist)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fetch-categories`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
};

export const handleSaveFields = async (category, watchlist, fields) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/update-watchlist-fields`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category.name,
          watchlist: watchlist.name,
          fields: fields,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Fields saved successfully");
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
};

export const fetchSingleWatchlist = async (category, watchlist) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/fetch-watchlist/${encodeURIComponent(
        category
      )}/${encodeURIComponent(watchlist)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
};

export const addCategory = async (categoryName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/add-category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoryName }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
};

export const removeCategory = async (categoryName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/remove-category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoryName }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
};
export const addWatchlist = async (category, watchlistName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/add-watchlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category, watchlistName }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
};

export const removeWatchlist = async (category, watchlistName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/remove-watchlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category, watchlistName }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
};
