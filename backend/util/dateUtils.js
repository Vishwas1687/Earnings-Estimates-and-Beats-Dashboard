export const extractDate = (dateString) => {
  return new Date(dateString).toISOString().split("T")[0];
}

// 2️⃣ Get a past quarter date given a starting date and a number (1=current, 2=prev, etc.)
export const getQuarterDate = (anchorDate, n) => {
  const date = new Date(anchorDate);

  // Move back (n-1) quarters
  date.setMonth(date.getMonth() - 3 * (n - 1));

  // Set to last day of that quarter
  const quarter = Math.floor(date.getMonth() / 3); // 0=Q1,1=Q2...
  const year = date.getFullYear();

  // Map quarter to its ending month and day
  const quarterEndMonths = [2, 5, 8, 11]; // Mar, Jun, Sep, Dec
  const month = quarterEndMonths[quarter];

  // Get last day of that month
  const lastDay = new Date(year, month + 1, 0).getDate();

  // Return formatted YYYY-MM-DD
  return `${year}-${String(month + 1).padStart(2, "0")}-${lastDay}`;
}

// 4️⃣ Get difference in quarters between two dates
export const getQuarterDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Convert both dates to "absolute quarter numbers"
  const q1 = Math.floor(d1.getMonth() / 3) + 1; // Q1=1, Q2=2, ...
  const q2 = Math.floor(d2.getMonth() / 3) + 1;

  const totalQuarters1 = d1.getFullYear() * 4 + (q1 - 1);
  const totalQuarters2 = d2.getFullYear() * 4 + (q2 - 1);

  return Math.abs(totalQuarters1 - totalQuarters2);
}

export const getParsedData = (dateStr) => {
  if (!dateStr) return "";

  // Convert to Date object
  const date = new Date(dateStr);

  // Get month name (short form) and year
  const month = date.toLocaleString("en-US", { month: "short" }); // "Jun"
  const year = date.getFullYear(); // 2025

  return `${month} ${year}`;
}