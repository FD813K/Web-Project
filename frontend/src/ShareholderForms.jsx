import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { PRODUCT_CATEGORIES } from "./constants/productCategories.js";
import {
  createInvestmentAxiosFunction,
  deleteInvestmentAxiosFunction,
  getApiErrorMessage,
  getDividendsAxiosFunction,
  getInvestmentsAxiosFunction,
  updateInvestmentAxiosFunction,
} from "./Service/api.js";

const addInvestmentSchema = z.object({
  name: z.string().min(1, "Name is required").max(70, "Name must be at most 70 characters"),
  category: z.enum(PRODUCT_CATEGORIES, { error: "Choose a product category" }),
  shares: z.number({ error: "Enter the number of shares" }).int().min(1, "Enter at least 1 share"),
  pricePerShare: z.number({ error: "Enter a price per share" }).min(0, "Price cannot be negative"),
});
const updateInvestmentSchema = z.object({
  investmentId: z.number({ error: "Enter an investment ID" }).int().min(1, "Enter a valid investment ID"),
  category: z.union([z.enum(PRODUCT_CATEGORIES), z.literal("")]).optional(),
  shares: z.number({ error: "Enter the number of shares" }).int().min(1, "Enter at least 1 share"),
});
const deleteInvestmentSchema = z.object({
  investmentId: z.number({ error: "Enter an investment ID" }).int().min(1, "Enter a valid investment ID"),
});

export default function ShareholderForms() {
  const [dividends, setDividends] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [dividendsLoading, setDividendsLoading] = useState(true);
  const [investmentsLoading, setInvestmentsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const formIds = ["shareholder-investment", "shareholder-update", "shareholder-dividends", "shareholder-delete"];
  const selectedId = location.hash.slice(1);
  const activeForm = formIds.includes(selectedId) ? selectedId : formIds[0];

  const {
    register: registerAddInvestment,
    handleSubmit: handleSubmitAddInvestment,
    formState: { errors: addInvestmentErrors },
  } = useForm({ resolver: zodResolver(addInvestmentSchema) });
  const {
    register: registerUpdateInvestment,
    handleSubmit: handleSubmitUpdateInvestment,
    formState: { errors: updateInvestmentErrors },
  } = useForm({ resolver: zodResolver(updateInvestmentSchema) });
  const {
    register: registerDeleteInvestment,
    handleSubmit: handleSubmitDeleteInvestment,
    formState: { errors: deleteInvestmentErrors },
  } = useForm({ resolver: zodResolver(deleteInvestmentSchema) });

  useEffect(() => {
    let active = true;
    getDividendsAxiosFunction()
      .then((result) => {
        if (active) setDividends(result);
      })
      .catch((error) => {
        if (active) setMessage(getApiErrorMessage(error, "Unable to load dividend records."));
      })
      .finally(() => {
        if (active) setDividendsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    getInvestmentsAxiosFunction()
      .then((result) => {
        if (active) setInvestments(result);
      })
      .catch((error) => {
        if (active) setMessage(getApiErrorMessage(error, "Unable to load investments."));
      })
      .finally(() => {
        if (active) setInvestmentsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function refreshInvestments() {
    setInvestments(await getInvestmentsAxiosFunction());
  }

  async function saveInvestment(data) {
    setMessage("");
    try {
      const result = await createInvestmentAxiosFunction(data);
      setMessage(`${result.message}. Investment ID: ${result.investmentId}`);
      await refreshInvestments();
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Unable to save the investment."));
    }
  }

  async function updateInvestment(data) {
    setMessage("");
    try {
      const result = await updateInvestmentAxiosFunction(data.investmentId, data);
      setMessage(result.message);
      await refreshInvestments();
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Unable to update the investment."));
    }
  }

  async function deleteInvestment(data) {
    setMessage("");
    try {
      const result = await deleteInvestmentAxiosFunction(data.investmentId);
      setMessage(result.message);
      await refreshInvestments();
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Unable to delete the investment."));
    }
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/stakeholders.css" />

      <Link to="/" className="back-btn">← Back to Home</Link>
      <main className="form-panel-page">
        <h1>Shareholder</h1>
        <nav className="form-panel-nav" aria-label="Shareholder forms">
          <Link to="/shareholder#shareholder-investment" aria-current={activeForm === "shareholder-investment" ? "page" : undefined}>Add investment</Link>
          <Link to="/shareholder#shareholder-update" aria-current={activeForm === "shareholder-update" ? "page" : undefined}>Update investment</Link>
          <Link to="/shareholder#shareholder-dividends" aria-current={activeForm === "shareholder-dividends" ? "page" : undefined}>Review dividends</Link>
          <Link to="/shareholder#shareholder-delete" aria-current={activeForm === "shareholder-delete" ? "page" : undefined}>Delete investment</Link>
        </nav>

        <section className={activeForm === "shareholder-investment" ? "form-panel active-panel" : "form-panel"} id="shareholder-investment">
          <h2>Insert investment</h2>
          <form className="simple-form" onSubmit={handleSubmitAddInvestment(saveInvestment)}>
            <label htmlFor="shareholder-investment-name">Name</label>
            <input id="shareholder-investment-name" type="text" maxLength="70" {...registerAddInvestment("name")} />
            {addInvestmentErrors.name && <span className="text-danger">{addInvestmentErrors.name.message}</span>}
            <label htmlFor="shareholder-investment-category">Product category</label>
            <select id="shareholder-investment-category" defaultValue="" {...registerAddInvestment("category")}>
              <option value="" disabled>Select a category</option>
              {PRODUCT_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            {addInvestmentErrors.category && <span className="text-danger">{addInvestmentErrors.category.message}</span>}
            <label htmlFor="shareholder-investment-shares">Number of shares</label>
            <input id="shareholder-investment-shares" type="number" min="1" step="1" {...registerAddInvestment("shares", { valueAsNumber: true })} />
            {addInvestmentErrors.shares && <span className="text-danger">{addInvestmentErrors.shares.message}</span>}
            <label htmlFor="shareholder-investment-price">Price per share</label>
            <input id="shareholder-investment-price" type="number" min="0" step="any" {...registerAddInvestment("pricePerShare", { valueAsNumber: true })} />
            {addInvestmentErrors.pricePerShare && <span className="text-danger">{addInvestmentErrors.pricePerShare.message}</span>}
            <button type="submit">Save</button>
          </form>
        </section>

        <section className={activeForm === "shareholder-update" ? "form-panel active-panel" : "form-panel"} id="shareholder-update">
          <h2>Update investment</h2>
          <form className="simple-form" onSubmit={handleSubmitUpdateInvestment(updateInvestment)}>
            <label htmlFor="shareholder-update-id">Investment ID</label>
            <input id="shareholder-update-id" type="number" min="1" step="1" {...registerUpdateInvestment("investmentId", { valueAsNumber: true })} />
            {updateInvestmentErrors.investmentId && <span className="text-danger">{updateInvestmentErrors.investmentId.message}</span>}
            <label htmlFor="shareholder-update-category">Product category</label>
            <select id="shareholder-update-category" defaultValue="" {...registerUpdateInvestment("category")}>
              <option value="">Keep current category</option>
              {PRODUCT_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            {updateInvestmentErrors.category && <span className="text-danger">{updateInvestmentErrors.category.message}</span>}
            <label htmlFor="shareholder-update-shares">New number of shares</label>
            <input id="shareholder-update-shares" type="number" min="1" step="1" {...registerUpdateInvestment("shares", { valueAsNumber: true })} />
            {updateInvestmentErrors.shares && <span className="text-danger">{updateInvestmentErrors.shares.message}</span>}
            <button type="submit">Update</button>
          </form>
          <h3>Current investments</h3>
          <table className="orders-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Category</th><th>Shares</th><th>Price per share</th></tr>
            </thead>
            <tbody>
              {investments.map((investment) => (
                <tr key={investment.investmentId}>
                  <td>{investment.investmentId}</td>
                  <td>{investment.name}</td>
                  <td>{investment.category}</td>
                  <td>{investment.shares}</td>
                  <td>${investment.pricePerShare}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {investmentsLoading && <p>Loading investments...</p>}
          {!investmentsLoading && investments.length === 0 && <p>No investments found.</p>}
        </section>

        <section className={activeForm === "shareholder-dividends" ? "form-panel active-panel" : "form-panel"} id="shareholder-dividends">
          <h2>Review dividends</h2>
          <table className="orders-table">
            <thead>
              <tr><th>Year</th><th>Shares</th><th>Dividend</th></tr>
            </thead>
            <tbody>
              {dividends.map((dividend) => (
                <tr key={dividend.year}>
                  <td>{dividend.year}</td>
                  <td>{dividend.shares}</td>
                  <td>${dividend.dividend}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {dividendsLoading && <p>Loading dividend records...</p>}
          {!dividendsLoading && dividends.length === 0 && <p>No dividend records found.</p>}
        </section>

        <section className={activeForm === "shareholder-delete" ? "form-panel active-panel" : "form-panel"} id="shareholder-delete">
          <h2>Delete investment</h2>
          <form className="simple-form" onSubmit={handleSubmitDeleteInvestment(deleteInvestment)}>
            <label htmlFor="shareholder-delete-id">Investment ID</label>
            <input id="shareholder-delete-id" type="number" min="1" step="1" {...registerDeleteInvestment("investmentId", { valueAsNumber: true })} />
            {deleteInvestmentErrors.investmentId && <span className="text-danger">{deleteInvestmentErrors.investmentId.message}</span>}
            <button type="submit">Withdraw</button>
          </form>
        </section>
        {message && <p className="helper-link" role="status">{message}</p>}
      </main>

    </>
  );
}