import { loadTemplates, saveTemplates } from "../util/templateUtil.js";
import { loadCategories, saveCategories } from "../util/categoryUtil.js";

export const fetchTemplatesController = (req, res) => {
  const templates = loadTemplates();
  res.json(templates);
};

export const editTemplateController = (req, res) => {
  const { templateName, fields } = req.body;
  if (!templateName || !fields) {
    return res
      .status(400)
      .json({ error: "Template name and fields are required" });
  }
  const templates = loadTemplates();
  const index = templates.findIndex((t) => t.templateName === templateName);
  if (index === -1) {
    return res.status(404).json({ error: "Template not found" });
  }
  templates[index] = { ...templates[index], fields };
  saveTemplates(templates);
  return res.json({ message: "Template updated successfully" });
};

export const deleteTemplateController = (req, res) => {
  const { templateName } = req.body;
  if (!templateName) {
    return res.status(400).json({ error: "Template name is required" });
  }
  const templates = loadTemplates();
  const updatedTemplates = templates.filter(
    (t) => t.templateName !== templateName
  );
  saveTemplates(updatedTemplates);
  return res.json({ message: "Template deleted successfully" });
};

export const createTemplateController = (req, res) => {
  const { templateName, fields } = req.body;
  if (!templateName || !fields) {
    return res
      .status(400)
      .json({ error: "Template name and fields are required" });
  }
  const templates = loadTemplates();
  templates.push({ templateName, fields });
  saveTemplates(templates);
  return res.status(201).json({ message: "Template created successfully" });
};

export const applyTemplateController = (req, res) => {
  console.log("Apply template controller reached");
  const { templateName, categoryName, watchlistName } = req.body;
  let categories = loadCategories();
  const categoryIndex = categories.findIndex(
    (c) => c.name === categoryName
  );
  if (categoryIndex === -1) {
    return res.status(404).json({ error: "Category not found" });
  }
  const watchlistIndex = categories[categoryIndex].watchlists.findIndex(
    (w) => w.name === watchlistName
  );
  if (watchlistIndex === -1) {
    return res.status(404).json({ error: "Watchlist not found" });
  }
  categories[categoryIndex].watchlists[watchlistIndex].templateName =
    templateName;
  saveCategories(categories);
  return res.json({ message: "Template applied to watchlist successfully" });
};
