import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadTemplates = () => {
  try {
    const data = fs.readFileSync(
      path.join(__dirname, "../store/template.json"),
      "utf-8"
    );
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading template.json, initializing with empty array");
    return [];
  }
};

export const saveTemplates = (data) => {
  try {
    fs.writeFileSync(
      path.join(__dirname, "../store/template.json"),
      JSON.stringify(data, null, 2)
    );
  } catch (err) {
    console.error("Error writing template.json:", err);
  }
};
