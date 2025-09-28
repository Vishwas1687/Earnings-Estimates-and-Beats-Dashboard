import { loadTickers, saveTickers } from "../util/tickerUtils.js";

export const tickersController = (req, res) => {
    try{
        const tickers = loadTickers();
        return res.json(tickers);
    } catch (error) {
        console.error("Error fetching tickers:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteCompanyController = (req, res) => {
    try{
        const tickers = loadTickers();
        const ticker = req.query.ticker;
        const updated_tickers = tickers.filter((stock)=>stock.ticker!==ticker);
        saveTickers(updated_tickers);
        return res.json(updated_tickers);
    } catch (error) {
        throw new Error("Error in deleting the company:", error);
    }
}