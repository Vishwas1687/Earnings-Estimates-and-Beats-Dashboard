// utils/tableConfig.js

export const fieldGroups = {
  basic: ["name", "price"],
  company: ["country", "industry", "sector"],
  return_ratios: ["ROE", "ROA"],
  margins: ["NPM", "OPM", "EBITDA_margin"],
  valuations: ["TTM_PE", "PB", "TTM_EPS"],
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
    "current_quarter_pb_fwd",
    "next_quarter_pb_fwd",
    "current_quarter_roe_earnings",
    "next_quarter_roe_earnings",
    "current_quarter_pb_valuation",
    "next_quarter_pb_valuation",
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
    "current_year_pb_fwd",
    "next_year_pb_fwd",
    "current_year_roe_earnings",
    "next_year_roe_earnings",
    "current_year_pb_valuation",
    "next_year_pb_valuation",
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
  pb_fwd: [
    "PB",
    "current_quarter_pb_fwd",
    "next_quarter_pb_fwd",
    "current_year_pb_fwd",
    "next_year_pb_fwd",
  ],
  roe_earnings: [
    "PB",
    "current_quarter_roe_earnings",
    "next_quarter_roe_earnings",
    "current_year_roe_earnings",
    "next_year_roe_earnings",
  ],
  pb_valuation: [
    "PB",
    "current_quarter_pb_valuation",
    "next_quarter_pb_valuation",
    "current_year_pb_valuation",
    "next_year_pb_valuation",
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
  PB: { header: "PB", width: 100, sortable: true, type: "number" },
  NPM: { header: "NPM", width: 100, sortable: true, type: "percentage" },
  OPM: { header: "OPM", width: 100, sortable: true, type: "percentage" },
  EBITDA_margin : { header: "EBIDTA_margin", width: 100, sortable: true, type: "percentage" }, 
  ROA: { header: "ROA", width: 100, sortable: true, type: "percentage" },
  ROE: { header: "ROE", width: 100, sortable: true, type: "percentage" },
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
  current_quarter_pb_fwd: {
    header: "Current Q PB Fwd",
    width: 180,
    sortable: true,
    type: "number",
  },
  next_quarter_pb_fwd: {
    header: "Next Q PB Fwd",
    width: 180,
    sortable: true,
    type: "number",
  },
  current_quarter_roe_earnings: {
    header: "Current Q ROE_Earnings",
    width: 180,
    sortable: true,
    type: "number",
  },
  next_quarter_roe_earnings: {
    header: "Next Q ROE_Earnings",
    width: 180,
    sortable: true,
    type: "number",
  },
  current_quarter_pb_valuation: {
    header: "Current Q PB Valuation",
    width: 180,
    sortable: true,
    type: "number",
  },
  next_quarter_pb_valuation: {
    header: "Next Q PB Valuation",
    width: 180,
    sortable: true,
    type: "number",
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
  current_year_pb_fwd: {
    header: "Current Y PB Fwd",
    width: 180,
    sortable: true,
    type: "number",
  },
  next_year_pb_fwd: {
    header: "Next Y Pb Fwd",
    width: 180,
    sortable: true,
    type: "number",
  },
  current_year_roe_earnings: {
    header: "Current Y ROE_Earnings",
    width: 180,
    sortable: true,
    type: "number",
  },
  next_year_roe_earnings: {
    header: "Next Y ROE_Earnings",
    width: 180,
    sortable: true,
    type: "number",
  },
  current_year_pb_valuation: {
    header: "Current Y PB Valuation",
    width: 180,
    sortable: true,
    type: "number",
  },
  next_year_pb_valuation: {
    header: "Next Y PB Valuation",
    width: 180,
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
  "OPM",
  "year_ago_eps",
  "current_year_eps",
  "next_year_eps",
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
