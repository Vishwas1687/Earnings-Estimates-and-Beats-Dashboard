// server.js
import express from "express";
import cors from "cors";
import { earningsBeatsController } from "./controllers/earningsBeatsController.js";
import { earningsEstimatesController } from "./controllers/earningsEstimatesController.js";
import { tickersController } from "./controllers/tickersController.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/earnings-beats", earningsBeatsController);
app.get("/api/earnings-estimates", earningsEstimatesController );
app.get("/api/fetch-tickers", tickersController);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
