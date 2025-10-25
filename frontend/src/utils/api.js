// utils/api.js
const API_BASE_URL = "http://localhost:5000";
export const fetchEarningsData = async (
  currentCategory,
  currentWatchlist,
  currentCountry,
  ticker,
  name,
  all
) => {
  try {
    var modifiedTicker = ticker;
    if (
      currentCountry === "IND" &&
      ticker &&
      !ticker.endsWith(".NS") &&
      all === "false"
    ) {
      modifiedTicker = `${ticker}.NS`;
    }
    const response = await fetch(
      `${API_BASE_URL}/api/fetch-earnings-estimates?category=${encodeURIComponent(
        currentCategory
      )}&watchlist=${encodeURIComponent(
        currentWatchlist
      )}&ticker=${encodeURIComponent(modifiedTicker)}&name=${encodeURIComponent(
        name
      )}&all=${all}`
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

export const addCompanyToWatchlist = async (
  ticker,
  name,
  category,
  watchlist,
  currentCountry
) => {
  try {
    var modifiedTicker = ticker;
    if (currentCountry === "IND" && !ticker.endsWith(".NS")) {
      modifiedTicker = `${ticker}.NS`;
    }
    const requestBody = {
      company: { ticker: modifiedTicker, name },
      category: category,
      watchlistName: watchlist,
    };

    console.log(
      "Sending request to add company:",
      JSON.stringify(requestBody, null, 2)
    );

    const response = await fetch(
      `${API_BASE_URL}/api/add-company-to-watchlist`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const data = await response.json();
    console.log("Success response:", data);
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
    const response = await fetch(
      `${API_BASE_URL}/api/delete-company?ticker=${encodeURIComponent(
        ticker
      )}&category=${encodeURIComponent(
        currentCategory
      )}&watchlist=${encodeURIComponent(currentWatchlist)}`
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
          category: category,
          watchlistName: watchlist,
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

export const createTemplate = async (templateName, fields) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/create-template`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ templateName, fields }),
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

export const fetchTemplates = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fetch-templates`);
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

export const editTemplate = async (templateName, fields) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/edit-template`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ templateName, fields }),
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

export const deleteTemplate = async (templateName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/delete-template`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ templateName }),
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

export const applyTemplate = async (
  templateName,
  categoryName,
  watchlistName
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/apply-template`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ templateName, categoryName, watchlistName }),
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
