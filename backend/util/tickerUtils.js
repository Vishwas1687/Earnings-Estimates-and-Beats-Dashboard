import fs from "fs";

export const loadTickers = () => {
  try {
    const data = fs.readFileSync("./store/tickers.json", "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error(
      "Error reading tickers.json, initializing with empty array"
    );
    return [];
  }
};

export const saveTickers = (data) => {
  try {
    fs.writeFileSync(
      "./store/tickers.json",
      JSON.stringify(data, null, 2)
    );
  } catch (err) {
    console.error("Error writing tickers.json:", err);
  }
};