import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadTickers = () => {
  try {
    const data = fs.readFileSync(
      path.join(__dirname, "../store/tickers.json"),
      "utf-8"
    );
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading tickers.json, initializing with empty array");
    return [];
  }
};

export const saveTickers = (data) => {
  try {
    fs.writeFileSync(
      path.join(__dirname, "../store/tickers.json"),
      JSON.stringify(data, null, 2)
    );
  } catch (err) {
    console.error("Error writing tickers.json:", err);
  }
};
