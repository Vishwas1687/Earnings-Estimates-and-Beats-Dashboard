import { loadCategories, saveCategories } from "../util/categoryUtil.js";

export const fetchCategoriesController = (req, res) => {
  try {
    const categories = loadCategories();
    return res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addCategoryController = (req, res) => {
  try {
    const categories = loadCategories();
    const categoryName = req.body.categoryName;
    const category = categories.find((cat) => cat.name === categoryName);
    if (category) {
      return res.status(400).json({ error: "Category already exists" });
    } else {
      const newCategory = { name: categoryName, watchlists: [] };
      categories.push(newCategory);
      saveCategories(categories);
      return res.json(newCategory);
    }
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeCategoryController = (req, res) => {
  try {
    const { categoryName } = req.body;
    let categories = loadCategories();
    const category = categories.find((cat) => cat.name === categoryName);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    } else {
      categories = categories.filter((cat) => cat.name !== categoryName);
      saveCategories(categories);
      return res.json({ message: "Category removed successfully" });
    }
  } catch (error) {
    console.error("Error removing category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
