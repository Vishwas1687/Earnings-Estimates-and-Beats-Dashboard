import { loadTemplates, saveTemplates } from "../util/templateUtil.js";
import { loadCategories, saveCategories } from "../util/categoryUtil.js";

export const fetchTemplatesController = (req, res) => {
  const templates = loadTemplates();
  res.json(templates);
};

export const editTemplateController = (req, res) => {
  try {
    const { templateName, fields } = req.body;
    if (!templateName || !fields) {
      return res
        .status(400)
        .json({ error: "Template name and fields are required" });
    }

    const templates = loadTemplates();

    // Check both possible property names for compatibility
    const index = templates.findIndex((t) => t.name === templateName);

    if (index === -1) {
      return res.status(404).json({ error: "Template not found" });
    }

    templates[index] = {
      ...templates[index],
      fields,
    };

    saveTemplates(templates);
    return res.json({
      message: "Template updated successfully",
      template: templates[index],
    });
  } catch (error) {
    console.error("Error updating template:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTemplateController = (req, res) => {
  const { templateName } = req.body;
  const categories = loadCategories();
  if (!templateName) {
    return res.status(400).json({ error: "Template name is required" });
  }
  const templates = loadTemplates();
  const updatedTemplates = templates.filter((t) => t.name !== templateName);
  const updatedCategories = categories.map((category) => {
    const updatedWatchlists = category.watchlists.map((watchlist) => {
      if (watchlist.templateName === templateName) {
        return { ...watchlist, templateName: null };
      }
      return watchlist;
    });
    return { ...category, watchlists: updatedWatchlists };
  });
  saveTemplates(updatedTemplates);
  saveCategories(updatedCategories);
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
  templates.push({ name: templateName, fields });
  saveTemplates(templates);
  return res.status(201).json({ message: "Template created successfully" });
};

export const applyTemplateController = (req, res) => {
  const { templateName, categoryName, watchlistName } = req.body;
  let categories = loadCategories();
  const categoryIndex = categories.findIndex((c) => c.name === categoryName);
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
