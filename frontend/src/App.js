// App.js
import { useState, useEffect, use } from "react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Toaster, toast } from "react-hot-toast";
import EarningsTable from "./components/EarningsTable/EarningsTable";
import AddCompanyForm from "./components/AddCompanyForm/AddCompanyForm";
import {
  fetchEarningsData,
  deleteStock,
  fetchCategories,
  fetchTemplates,
  addCompanyToWatchlist,
} from "./utils/api";
import "./App.css";

function App() {
  const [categories, setCategories] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [watchlistList, setWatchlistList] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentWatchlist, setCurrentWatchlist] = useState(null);
  const [fields, setFields] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialFields, setInitialFields] = useState([
    "name",
    "price",
    "country",
  ]);

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
        toast.error("Company already exists in the table");
        setLoading(false);
        return;
      }

      const data = await addCompanyToWatchlist(
        ticker,
        name,
        currentCategory,
        currentWatchlist
      );
      if (data) {
        const companyData = await fetchEarningsData(
          currentCategory,
          currentWatchlist,
          ticker,
          name,
          false
        );
        if (companyData) {
          setCompanies((prev) => [...prev, companyData.filtered_data]);
        }
      }
    } catch (err) {
      setError(`Failed to fetch data for ${ticker}: ${err.message}`);
      toast.error(`Failed to add ${ticker}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteCompany = async (ticker) => {
    try {
      console.log("Deleting company with ticker:", ticker);
      const result = await deleteStock(ticker, currentCategory, currentWatchlist);
      setCompanies((prev) => prev.filter((company) => company.ticker !== ticker));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const response = await fetchCategories();
        setWatchlistList([]);
        setCategoryList([]);
        setCategories(response);
        setCurrentCategory(response[0].name);
        setCurrentWatchlist(response[0].watchlists[0].name);
        setFields(response[0].watchlists[0].fields);
        setCurrentTemplate(response[0].watchlists[0].templateName || null);
        for (const category of response) {
          setCategoryList((prev) => [...prev, category.name]);
        }
        for (const watchlist of response[0].watchlists) {
          setWatchlistList((prev) => [...prev, watchlist.name]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const fetchTemplatesData = async () => {
      try {
        const templates = await fetchTemplates();
        setTemplates(templates);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategoriesData();
    fetchTemplatesData();
  }, []);

  useEffect(() => {
    const fetchCompanies = async (category, watchlist) => {
      setLoading(true);
      try {
        const data = await fetchEarningsData(
          category,
          watchlist,
          null,
          null,
          true
        );
        setCompanies(data.filtered_data);
      } catch (err) {
        setError(`Failed to fetch companies: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    if (!currentCategory || !currentWatchlist) return;
    const category = categories.find((cat) => cat.name === currentCategory);
    if (!category) {
      setFields(initialFields);
      setCurrentTemplate(null);
    }
    const watchlist = category.watchlists.find(
      (wl) => wl.name === currentWatchlist
    );
    if (!watchlist) return;
    setCurrentTemplate(watchlist.templateName || null);
    if (
      watchlist.templateName !== null &&
      watchlist.templateName !== undefined
    ) {
      const template = templates.find((t) => t.name === watchlist.templateName);
      setFields(template.fields);
    } else {
      setFields(initialFields);
    }
    fetchCompanies(currentCategory, currentWatchlist);
  }, [currentCategory, currentWatchlist]);

  return (
    <MantineProvider>
      <div className="App">
        <h1>Earnings Estimate Dashboard</h1>

        <AddCompanyForm
          onAddCompany={addCompany}
          loading={loading}
          error={error}
        />

        <EarningsTable
          loading={loading}
          companies={companies}
          onDeleteCompany={deleteCompany}
          categories={categories}
          setCategories={setCategories}
          categoryList={categoryList}
          setCategoryList={setCategoryList}
          watchlistList={watchlistList}
          setWatchlistList={setWatchlistList}
          setCurrentWatchlist={setCurrentWatchlist}
          setCurrentCategory={setCurrentCategory}
          setFields={setFields}
          setCompanies={setCompanies}
          currentCategory={currentCategory}
          currentWatchlist={currentWatchlist}
          templates={templates}
          setTemplates={setTemplates}
          currentTemplate={currentTemplate}
          setCurrentTemplate={setCurrentTemplate}
          fields={fields}
        />
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </MantineProvider>
  );
}

export default App;
