// server.js
import express from "express";
import cors from "cors";
import { earningsBeatsController } from "./controllers/earningsBeatsController.js";
import { earningsEstimatesController } from "./controllers/earningsEstimatesController.js";
import {
  deleteCompanyController,
  tickersController,
} from "./controllers/tickersController.js";
import { priceTargetsController } from "./controllers/priceTargetsController.js";
import {
  fetchCategoriesController,
  addCategoryController,
  removeCategoryController,
} from "./controllers/categoryController.js";
import {
  fetchWatchlistController,
  addWatchlistController,
  removeWatchlistController,
  addCompanyToWatchlistController,
  removeCompanyFromWatchlistController,
  updateWatchlistFieldsController,
  fetchSingleWatchlistController,
} from "./controllers/watchlistController.js";

import {
  fetchTemplatesController,
  editTemplateController,
  deleteTemplateController,
  createTemplateController,
  applyTemplateController,
} from "./controllers/templateController.js";
const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/earnings-beats", earningsBeatsController);
app.get("/api/fetch-earnings-estimates", earningsEstimatesController);

app.get("/api/fetch-tickers", tickersController);
app.get("/api/delete-company", deleteCompanyController);
app.post("/api/price-targets", priceTargetsController);

app.get("/api/fetch-categories", fetchCategoriesController);
app.post("/api/add-category", addCategoryController);
app.post("/api/remove-category", removeCategoryController);

app.get("/api/fetch-watchlists/:category", fetchWatchlistController);
app.post("/api/add-watchlist", addWatchlistController);
app.post("/api/remove-watchlist", removeWatchlistController);
app.post("/api/add-company-to-watchlist", addCompanyToWatchlistController);
app.post(
  "/api/remove-company-from-watchlist",
  removeCompanyFromWatchlistController
);
app.post("/api/update-watchlist-fields", updateWatchlistFieldsController);

app.get(
  "/api/fetch-watchlist/:category/:watchlist",
  fetchSingleWatchlistController
);

app.get("/api/fetch-templates", fetchTemplatesController);
app.post("/api/edit-template", editTemplateController);
app.post("/api/delete-template", deleteTemplateController);
app.post("/api/create-template", createTemplateController);
app.post("/api/apply-template", applyTemplateController);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
