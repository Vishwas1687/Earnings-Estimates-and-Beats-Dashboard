import { loadEarningsBeats, saveEarningsBeats, 
         getEarningsBeatsData, cleanEarningsBeatsData } from "../util/earningsBeatsUtil.js";

export const earningsBeatsController = async (req, res) => {
  try {
    let earningsBeats = loadEarningsBeats();
    const ticker = req.query.ticker;
    const name = req.query.name;
    var filtered_data = {};
    // Deduplication check
    if (!earningsBeats.some(item => item.price.ticker === ticker) ){
      result = await getEarningsBeatsData(ticker);
      filtered_data = cleanEarningsBeatsData(ticker, name, result);
      filtered_data.timestamp = Date.now();
      earningsBeats.push(filtered_data);
      saveEarningsBeats(earningsBeats);
    } else if (earningsBeats[price.ticker].timestamp < Date.now() - 86400000) {
      earningsBeats = earningsBeats.filter(item => item.price.ticker !== ticker);
      result = await getEarningsBeatsData(ticker);
      filtered_data = cleanEarningsBeatsData(ticker, name, result);
      filtered_data.timestamp = Date.now();
      earningsBeats.push(filtered_data);
      saveEarningsBeats(earningsBeats);
    } else {
      filtered_data = earningsBeats.find(item => item.price.ticker === ticker);
    }
    res.json({ filtered_data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

