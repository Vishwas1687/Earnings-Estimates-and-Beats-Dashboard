import { loadTickers } from "../util/tickerUtils.js";

export const tickersController = (req, res) => {
    try{
        const tickers = loadTickers();
        return res.json(tickers);
    } catch (error) {
        console.error("Error fetching tickers:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}