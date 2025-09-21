// App.js
import { useState, useEffect, use } from "react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import EarningsTable from "./components/EarningsTable/EarningsTable";
import AddCompanyForm from "./components/AddCompanyForm/AddCompanyForm";
import { fetchEarningsData, fetchTickers } from "./utils/api";
import "./App.css";

function App() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tickersLoaded, setTickersLoaded] = useState(false);

  const addCompany = async (ticker, name) => {
    setLoading(true);
    setError(null);

    try {
      // Check if company already exists
      const existingCompany = companies.find(
        (company) => company.ticker?.toLowerCase() === ticker.toLowerCase()
      );

      if (existingCompany) {
        setError("Company already exists in the table");
        setLoading(false);
        return;
      }

      const data = await fetchEarningsData(ticker, name);

      if (data) {
        const newCompany = {
          ...data,
          id: Date.now(), // Simple ID generation
          ticker,
          name,
        };
        setCompanies((prev) => [...prev, newCompany]);
      }
    } catch (err) {
      setError(`Failed to fetch data for ${ticker}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteCompany = (id) => {
    setCompanies((prev) => prev.filter((company) => company.id !== id));
  };

  useEffect(() => {
    if (tickersLoaded) return;

    const fetchTickerData = async () => {
      try {
        const tickers = await fetchTickers();
        for (const ticker of tickers) {
          await addCompany(ticker.ticker, ticker.name);
        }
        setTickersLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTickerData();
  }, [tickersLoaded]);

  return (
    <MantineProvider>
      <div className="App">
        <h1>Earnings Estimate Dashboard</h1>

        <AddCompanyForm
          onAddCompany={addCompany}
          loading={loading}
          error={error}
        />

        <EarningsTable companies={companies} onDeleteCompany={deleteCompany} />
      </div>
    </MantineProvider>
  );
}

export default App;
