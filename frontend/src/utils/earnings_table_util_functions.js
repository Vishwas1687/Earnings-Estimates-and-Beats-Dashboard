import { handleFetchComplexFields } from "./field_manipulation";

export const sortFields = (result, sortOrder, sortColumn, plainColumns, columnDefinitions) => {
  // Apply sorting second (to both filtered and unfiltered results)
  if (sortColumn && sortOrder) {
    const getValueForSorting = (company, columnKey) => {
      let value = 0;
      if (plainColumns.includes(columnKey)) {
        value = company[columnKey] ?? 0;
      } else {
        const result = handleFetchComplexFields(company, columnKey);
        value = result?.value ?? 0;
      }
      return value;
    };

    result = [...result].sort((a, b) => {
      const colDef = columnDefinitions[sortColumn];
      if (!colDef) return 0;

      // Get raw values for both companies
      const aValue = getValueForSorting(a, sortColumn);
      const bValue = getValueForSorting(b, sortColumn);

      // Convert to numbers for proper sorting
      const aNum = parseFloat(aValue) || 0;
      const bNum = parseFloat(bValue) || 0;

        // Apply sort order
      if (sortOrder === "asc") {
        return aNum - bNum; // Ascending
      } else if (sortOrder === "desc") {
        return bNum - aNum; // Descending
      }

      return 0;
    });
  }
  return result;
}