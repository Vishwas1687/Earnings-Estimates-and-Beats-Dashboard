import YahooFinance from "yahoo-finance2";
import fs from "fs";

export const getEarningsBeatsData = async(ticker) => {
  const result = await YahooFinance.quoteSummary(ticker, {
      modules: [
        "assetProfile",
        "price",
        "earningsHistory",
      ]
    });
  return result;
}

export const cleanEarningsBeatsData = (ticker, name, data) => {
  const currency = data.price.currency;
  const price = data.price.regularMarketPrice;
  const industry = data.assetProfile?.industryKey || "N/A";
  const sector = data.assetProfile?.sectorKey || "N/A";
}

export const loadEarningsBeats = () => {
  try {
    const data = fs.readFileSync("../store/earnings_beats.json", "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading earnings_beats.json, initializing with empty array");
    return [];
  }
};

export const saveEarningsBeats = (data) => {
  try {
    fs.writeFileSync("../store/earnings_beats.json", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing earnings_beats.json:", err);
  }
};