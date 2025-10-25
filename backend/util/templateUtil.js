import fs from "fs";

export const loadTemplates = () => {
  try {
    const data = fs.readFileSync("./store/template.json", "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading template.json, initializing with empty array");
    return [];
  }
};

export const saveTemplates = (data) => {
  try {
    fs.writeFileSync("./store/template.json", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing template.json:", err);
  }
};
