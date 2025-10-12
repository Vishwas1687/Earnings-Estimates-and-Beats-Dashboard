const handlePriceTargetFields = (company, field) => {
  // Single configuration object instead of 3 separate maps
  const fieldConfig = {
    current_year_pe_price_target: {
      period: "Current Year",
      metric: "pe",
      target: "priceChange",
    },
    current_year_pb_fwd_price_target: {
      period: "Current Year",
      metric: "pb_fwd",
      target: "priceChange",
    },
    next_year_pe_price_target: {
      period: "Next Year",
      metric: "pe",
      target: "priceChange",
    },
    next_year_pb_fwd_price_target: {
      period: "Next Year",
      metric: "pb_fwd",
      target: "priceChange",
    },
    current_year_pe_target: {
      period: "Current Year",
      metric: "pe",
      target: "Value",
    },
    current_year_pb_fwd_target: {
      period: "Current Year",
      metric: "pb_fwd",
      target: "Value",
    },
    next_year_pe_target: { period: "Next Year", metric: "pe", target: "Value" },
    next_year_pb_fwd_target: {
      period: "Next Year",
      metric: "pb_fwd",
      target: "Value",
    },
  };

  const config = fieldConfig[field];
  if (!config) return null;

  const metricObj =
    company.filtered_data?.priceTarget?.[config.period]?.[config.metric];

  return {
    value: metricObj?.[config.target],
    analystCount: 0,
  };
};

const handleRevenueFields = (company, field) => {
  // Define field mappings
  const fieldMap = {
    current_quarter_revenue_growth: "Current Quarter",
    next_quarter_revenue_growth: "Next Quarter",
    current_year_revenue_growth: "Current Year",
    next_year_revenue_growth: "Next Year",
  };

  const periodKey = fieldMap[field];
  if (!periodKey) return null;

  const revenueTrendPeriod = company.filtered_data?.revenueTrend?.[periodKey];

  return revenueTrendPeriod
    ? {
        value: revenueTrendPeriod.revenue_growth,
        analystCount: revenueTrendPeriod.analystCount,
      }
    : null;
};

const handleEarningsFields = (company, field) => {
  if (field === "year_ago_eps") {
    return {
      value:
        company.filtered_data.earningsTrend["Current Year"]?.year_ago_eps ?? 0,
      analystCount: 0,
    };
  }
  // Period mapping
  const periodMap = {
    current_quarter: "Current Quarter",
    next_quarter: "Next Quarter",
    current_year: "Current Year",
    next_year: "Next Year",
  };

  // Metric to data key mapping
  const metricMap = {
    eps_growth: "eps_growth",
    eps: "eps_estimate",
    peg: "peg",
    pe: "pe",
    pb_fwd: "pb_fwd",
    roe_earnings: "roe_earnings",
    pb_valuation: "pb_valuation",
  };

  // Find period from field name
  const period = Object.keys(periodMap).find((p) => field.includes(p));
  if (!period) return { value: 0, analystCount: 0 };

  // Find metric from field name (order matters - check eps_growth before eps)
  const metric = [
    "eps_growth",
    "peg",
    "pe",
    "eps",
    "pb_fwd",
    "roe_earnings",
    "pb_valuation",
  ].find((m) => field.includes(m));
  if (!metric) return { value: 0, analystCount: 0 };

  // Get period data
  const periodData = company.filtered_data?.earningsTrend?.[periodMap[period]];
  if (!periodData) return { value: 0, analystCount: 0 };

  // Return formatted result
  return {
    value: periodData[metricMap[metric]] ?? 0,
    analystCount: periodData.analystCount ?? 0,
  };
};

// Elegant solution with field mapping
export const handleFetchComplexFields = (company, field) => {
  if (field.includes("revenue")) {
    return handleRevenueFields(company, field);
  } else if (field.includes("target")) {
    return handlePriceTargetFields(company, field);
  } else {
    return handleEarningsFields(company, field);
  }
};

// Utility function to organize fields by categories/groups
export const organizeFields = (
  fieldGroups,
  fieldCategories
) => {
  const allFields = new Set();

  // Handle templateList as array or object
  Object.entries(fieldGroups).forEach(([group, fields]) => {
    fields.forEach((field) => allFields.add(field));
  });

  Object.entries(fieldCategories).forEach(([category, fields]) => {
    fields.forEach((field) => allFields.add(field));
  });

  const organized = {};
  const usedFields = new Set();

  // Priority to fieldCategories
  Object.entries(fieldCategories).forEach(([category, fields]) => {
    const availableFields = fields.filter((f) => allFields.has(f));
    if (availableFields.length > 0) {
      organized[category] = availableFields;
      availableFields.forEach((f) => usedFields.add(f));
    }
  });

  // Then fieldGroups for remaining fields
  Object.entries(fieldGroups).forEach(([group, fields]) => {
    const availableFields = fields.filter(
      (f) => allFields.has(f) && !usedFields.has(f)
    );
    if (availableFields.length > 0) {
      organized[group] = availableFields;
      availableFields.forEach((f) => usedFields.add(f));
    }
  });
  return organized;
};

// Format field names for display
export const formatFieldName = (field) => {
  return field
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
