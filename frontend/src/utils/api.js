// utils/api.js
const API_BASE_URL = "http://localhost:5000";

export const fetchEarningsData = async (ticker, name) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/earnings-estimates?ticker=${encodeURIComponent(
        ticker
      )}&name=${encodeURIComponent(name)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
};

export const fetchTickers = async() => {
  // Example static list of tickers; replace with dynamic fetching if needed
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/fetch-tickers`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
}
