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
        company.filtered_data.earningsTrend["Current Year"]?.year_ago_eps ??
        0,
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
    pb_valuation: "pb_valuation"
  };

  // Find period from field name
  const period = Object.keys(periodMap).find((p) => field.includes(p));
  if (!period) return { value: 0, analystCount: 0 };

  // Find metric from field name (order matters - check eps_growth before eps)
  const metric = ["eps_growth", "peg", "pe", "eps", "pb_fwd", "roe_earnings", "pb_valuation"].find((m) =>
    field.includes(m)
  );
  if (!metric) return { value: 0, analystCount: 0 };

  // Get period data
  const periodData =
    company.filtered_data?.earningsTrend?.[periodMap[period]];
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
  } else {
    return handleEarningsFields(company, field);
  } 
};

