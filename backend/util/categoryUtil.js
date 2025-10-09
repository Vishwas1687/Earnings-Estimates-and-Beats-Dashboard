import fs from "fs";

export const loadCategories = () => {
  try {
    const data = fs.readFileSync("./store/categories.json", "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error(
      "Error reading categories.json, initializing with empty array"
    );
    return [];
  }
};

export const saveCategories = (data) => {
  try {
    fs.writeFileSync(
      "./store/categories.json",
      JSON.stringify(data, null, 2)
    );
  } catch (err) {
    console.error("Error writing categories.json:", err);
  }
};
