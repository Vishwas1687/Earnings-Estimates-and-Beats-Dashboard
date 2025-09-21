// utils/tableConfig.js

export const fieldGroups = {
  basic: ["name", "price"],
  company: ["country", "industry", "sector"],
  ttm: ["TTM_PE", "TTM_EPS"],
  yearAgo: ["year_ago_eps"],
  quarters: [
    "current_quarter_eps",
    "next_quarter_eps",
    "current_quarter_eps_growth",
    "next_quarter_eps_growth",
    "current_quarter_pe",
    "next_quarter_pe",
    "current_quarter_peg",
    "next_quarter_peg",
    "current_quarter_revenue_growth",
    "next_quarter_revenue_growth",
  ],
  yearly: [
    "current_year_eps",
    "next_year_eps",
    "current_year_eps_growth",
    "next_year_eps_growth",
    "current_year_pe",
    "next_year_pe",
    "current_year_peg",
    "next_year_peg",
    "current_year_revenue_growth",
    "next_year_revenue_growth",
  ],
};

export const fieldCategories = {
  eps: [
    "year_ago_eps",
    "TTM_EPS",
    "current_quarter_eps",
    "next_quarter_eps",
    "current_year_eps",
    "next_year_eps",
  ],
  epsGrowth: [
    "current_quarter_eps_growth",
    "next_quarter_eps_growth",
    "current_year_eps_growth",
    "next_year_eps_growth",
  ],
  pe: [
    "TTM_PE",
    "current_quarter_pe",
    "next_quarter_pe",
    "current_year_pe",
    "next_year_pe",
  ],
  peg: [
    "current_quarter_peg",
    "next_quarter_peg",
    "current_year_peg",
    "next_year_peg",
  ],
  revenueGrowth: [
    "current_quarter_revenue_growth",
    "next_quarter_revenue_growth",
    "current_year_revenue_growth",
    "next_year_revenue_growth",
  ],
};

export const columnDefinitions = {
  delete: { header: "Delete", width: 70, sortable: false },
  toggleAnalysts: { header: "Analysts", width: 100, sortable: false },
  resetOrder: { header: "Reset Order", width: 120, sortable: false },
  name: { header: "Company Name", width: 200, sortable: false },
  price: { header: "Price ($)", width: 100, sortable: false, type: "currency" },
  country: { header: "Country", width: 120, sortable: false },
  industry: { header: "Industry", width: 150, sortable: false },
  sector: { header: "Sector", width: 150, sortable: false },
  TTM_PE: { header: "TTM P/E", width: 100, sortable: true, type: "number" },
  TTM_EPS: { header: "TTM EPS", width: 100, sortable: false, type: "number" },
  year_ago_eps: {
    header: "Year Ago EPS",
    width: 120,
    sortable: false,
    type: "number",
  },

  // Current Quarter
  current_quarter_eps: {
    header: "Current Q EPS",
    width: 120,
    sortable: false,
    type: "number",
  },
  next_quarter_eps: {
    header: "Next Q EPS",
    width: 120,
    sortable: false,
    type: "number",
  },
  current_quarter_eps_growth: {
    header: "Current Q EPS Growth (%)",
    width: 150,
    sortable: true,
    type: "percentage",
  },
  next_quarter_eps_growth: {
    header: "Next Q EPS Growth (%)",
    width: 150,
    sortable: true,
    type: "percentage",
  },
  current_quarter_pe: {
    header: "Current Q P/E",
    width: 120,
    sortable: true,
    type: "number",
  },
  next_quarter_pe: {
    header: "Next Q P/E",
    width: 120,
    sortable: true,
    type: "number",
  },
  current_quarter_peg: {
    header: "Current Q PEG",
    width: 120,
    sortable: true,
    type: "number",
  },
  next_quarter_peg: {
    header: "Next Q PEG",
    width: 120,
    sortable: true,
    type: "number",
  },
  current_quarter_revenue_growth: {
    header: "Current Q Revenue Growth (%)",
    width: 180,
    sortable: true,
    type: "percentage",
  },
  next_quarter_revenue_growth: {
    header: "Next Q Revenue Growth (%)",
    width: 180,
    sortable: true,
    type: "percentage",
  },

  // Current Year
  current_year_eps: {
    header: "Current Y EPS",
    width: 120,
    sortable: false,
    type: "number",
  },
  next_year_eps: {
    header: "Next Y EPS",
    width: 120,
    sortable: false,
    type: "number",
  },
  current_year_eps_growth: {
    header: "Current Y EPS Growth (%)",
    width: 150,
    sortable: true,
    type: "percentage",
  },
  next_year_eps_growth: {
    header: "Next Y EPS Growth (%)",
    width: 150,
    sortable: true,
    type: "percentage",
  },
  current_year_pe: {
    header: "Current Y P/E",
    width: 120,
    sortable: true,
    type: "number",
  },
  next_year_pe: {
    header: "Next Y P/E",
    width: 120,
    sortable: true,
    type: "number",
  },
  current_year_peg: {
    header: "Current Y PEG",
    width: 120,
    sortable: true,
    type: "number",
  },
  next_year_peg: {
    header: "Next Y PEG",
    width: 120,
    sortable: true,
    type: "number",
  },
  current_year_revenue_growth: {
    header: "Current Y Revenue Growth (%)",
    width: 180,
    sortable: true,
    type: "percentage",
  },
  next_year_revenue_growth: {
    header: "Next Y Revenue Growth (%)",
    width: 180,
    sortable: true,
    type: "percentage",
  },
};

// Default visible columns (logical ordering)
export const defaultVisibleColumns = [
  "name",
  "price",
  "country",
  "industry",
  "sector",
  "TTM_PE",
  "TTM_EPS",
  "year_ago_eps",
  "current_quarter_eps",
  "next_quarter_eps",
  "current_year_eps",
  "next_year_eps",
  "current_quarter_eps_growth",
  "next_quarter_eps_growth",
  "current_year_eps_growth",
  "next_year_eps_growth",
];

export const formatValue = (value, type, country) => {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  switch (type) {
    case "currency":
      return country === "US"
        ? "$" + Number(value).toFixed(2)
        : "\u20B9" + Number(value).toFixed(2);
    case "percentage":
      return `${Number(value).toFixed(2)}%`;
    case "number":
      return Number(value).toFixed(2);
    default:
      return value;
  }
};
