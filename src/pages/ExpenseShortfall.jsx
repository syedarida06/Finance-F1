
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ExpenseShortfall.css";

const API_URL = "http://localhost:5000/api/features";

const expenseCategories = [
  { key: "rent", category: "Rent", label: "House Rent" },
  { key: "groceries", category: "Groceries", label: "Groceries" },
  { key: "electricity", category: "Electricity", label: "Electricity" },
  { key: "bills", category: "Other Bills", label: "Other Bills" },
  { key: "loan", category: "Loan Payments", label: "Loan Payments" },
  {
    key: "other",
    category: "Other Essential Expenses",
    label: "Other Essential Expenses",
  },
];

function formatAmount(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

function formatDate(value) {
  if (!value) return "Not specified";

  const datePart = String(value).split("T")[0];
  const parts = datePart.split("-");

  if (parts.length === 3) {
    return new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    ).toLocaleDateString("en-IN");
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Not specified"
    : date.toLocaleDateString("en-IN");
}

function ExpenseShortfall() {
  const navigate = useNavigate();

  const [availableMoney, setAvailableMoney] = useState("");
  const [expectedIncome, setExpectedIncome] = useState("");

  const [expenses, setExpenses] = useState({
    rent: "",
    groceries: "",
    electricity: "",
    bills: "",
    loan: "",
    other: "",
  });

  const [result, setResult] = useState(null);
  const [savedExpenses, setSavedExpenses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Retrieve actual expense records from PostgreSQL
  const fetchExpenses = async () => {
    const token = localStorage.getItem("finoraToken");

    if (!token) {
      navigate("/login", { replace: true });
      return [];
    }

    const response = await fetch(`${API_URL}/expenses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      localStorage.removeItem("finoraToken");
      localStorage.removeItem("finoraUser");
      navigate("/login", { replace: true });
      throw new Error("Your session expired. Please sign in again.");
    }

    if (!response.ok) {
      throw new Error(data.message || "Unable to load saved expenses.");
    }

    const records = Array.isArray(data)
      ? data
      : data.expenses || data.records || data.data || [];

    if (!Array.isArray(records)) {
      throw new Error("Invalid expense records received from the server.");
    }

    setSavedExpenses(records);
    return records;
  };

  // Load saved expenses when the page opens
  useEffect(() => {
    const loadExpenses = async () => {
      try {
        await fetchExpenses();
      } catch (err) {
        setError(err.message || "Could not load saved expenses.");
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, [navigate]);

  // Live calculation from the user's current entries
  const totalExpenses = Object.values(expenses).reduce(
    (total, value) => total + (Number(value) || 0),
    0
  );

  const totalFunds =
    (Number(availableMoney) || 0) +
    (Number(expectedIncome) || 0);

  const shortfall = Math.max(0, totalExpenses - totalFunds);
  const remaining = Math.max(0, totalFunds - totalExpenses);

  // Total of all expense records currently saved in the database
  const savedTotal = savedExpenses.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;

    setExpenses((prev) => ({
      ...prev,
      [name]: value,
    }));

    setResult(null);
    setError("");
    setSuccess("");
  };

  const validateAmounts = () => {
    const allValues = [
      availableMoney,
      expectedIncome,
      ...Object.values(expenses),
    ];

    return allValues.every(
      (value) =>
        value === "" ||
        (Number.isFinite(Number(value)) && Number(value) >= 0)
    );
  };

  // Calculate shortfall and save expense records
  const checkShortfall = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setResult(null);

    if (availableMoney.trim() === "" || expectedIncome.trim() === "") {
      setError("Please enter your available money and expected income.");
      return;
    }

    if (!validateAmounts()) {
      setError("Please enter valid non-negative amounts.");
      return;
    }

    const expenseEntries = expenseCategories
      .map((item) => ({
        category: item.category,
        amount: Number(expenses[item.key] || 0),
      }))
      .filter((item) => item.amount > 0);

    if (expenseEntries.length === 0) {
      setError("Please enter at least one essential expense.");
      return;
    }

    const token = localStorage.getItem("finoraToken");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setSaving(true);

    try {
      let newlySaved = 0;

      // Avoid saving an identical category and amount repeatedly
      for (const item of expenseEntries) {
        const alreadySaved = savedExpenses.some(
          (saved) =>
            String(saved.category || "").trim().toLowerCase() ===
              item.category.toLowerCase() &&
            Number(saved.amount) === item.amount &&
            !saved.due_date
        );

        if (alreadySaved) {
          continue;
        }

        const response = await fetch(`${API_URL}/expenses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category: item.category,
            amount: item.amount,
            due_date: null,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
          localStorage.removeItem("finoraToken");
          localStorage.removeItem("finoraUser");
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message || `Unable to save ${item.category}.`
          );
        }

        newlySaved++;
      }

      // Calculate from the currently entered amounts
      const funds =
        Number(availableMoney) + Number(expectedIncome);

      const expenseTotal = expenseEntries.reduce(
        (total, item) => total + item.amount,
        0
      );

      setResult({
        totalFunds: funds,
        totalExpenses: expenseTotal,
        shortfall: Math.max(0, expenseTotal - funds),
        remaining: Math.max(0, funds - expenseTotal),
      });

      setSuccess(
        newlySaved > 0
          ? "Your essential expenses have been saved successfully."
          : "These expense entries are already saved. No duplicate records were added."
      );

      // Refresh database history after saving
      try {
        await fetchExpenses();
      } catch (refreshError) {
        setError(
          "Your entries were saved, but the saved history could not be refreshed. Reload the page to see the latest records."
        );
      }
    } catch (err) {
      console.error("Expense saving error:", err);
      setError(err.message || "Unable to save your expenses.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="shortfall-page">
      <nav className="shortfall-navbar">
        <Link to="/user-dashboard" className="shortfall-logo">
          FINORA<span>.</span>
        </Link>

        <Link to="/user-dashboard" className="shortfall-back">
          ← Back to Dashboard
        </Link>
      </nav>

      <main className="shortfall-container">
        <div className="shortfall-heading">
          <p className="shortfall-tag">FINANCIAL PLANNING</p>

          <h1>Essential Expense Shortfall Alert</h1>

          <p>
            Know whether your available funds and expected income
            will be enough to cover your upcoming essential expenses.
          </p>
        </div>

        <form className="shortfall-form" onSubmit={checkShortfall}>
          <section className="shortfall-section">
            <h2>Your Available Funds</h2>

            <p>
              Enter the money you currently have and the income
              you expect to receive.
            </p>

            <div className="shortfall-input-grid">
              <div className="shortfall-field">
                <label>Available Money (₹)</label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={availableMoney}
                  onChange={(e) => {
                    setAvailableMoney(e.target.value);
                    setResult(null);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Enter available money"
                  required
                />
              </div>

              <div className="shortfall-field">
                <label>Expected Income (₹)</label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={expectedIncome}
                  onChange={(e) => {
                    setExpectedIncome(e.target.value);
                    setResult(null);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Enter expected income"
                  required
                />
              </div>
            </div>
          </section>

          <section className="shortfall-section">
            <h2>Upcoming Essential Expenses</h2>

            <p>
              Enter the amounts you need to pay. Leave a field blank
              when that expense does not apply.
            </p>

            <div className="shortfall-input-grid">
              {expenseCategories.map((item) => (
                <div className="shortfall-field" key={item.key}>
                  <label>{item.label} (₹)</label>

                  <input
                    type="number"
                    name={item.key}
                    min="0"
                    step="0.01"
                    value={expenses[item.key]}
                    onChange={handleExpenseChange}
                    placeholder="Enter amount"
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="shortfall-submit">
            <button type="submit" disabled={saving}>
              {saving ? "Saving Expenses..." : "Check Financial Shortfall"}
            </button>
          </div>
        </form>

        {error && (
          <p role="alert" style={{ color: "red", marginTop: "15px" }}>
            {error}
          </p>
        )}

        {success && (
          <p role="status" style={{ marginTop: "15px" }}>
            {success}
          </p>
        )}

        {/* Live expense overview */}
        <section className="shortfall-summary">
          <h2>Your Expense Overview</h2>

          <div className="shortfall-summary-grid">
            <div className="shortfall-card">
              <p>Total Available Funds</p>
              <h3>₹{formatAmount(totalFunds)}</h3>
            </div>

            <div className="shortfall-card">
              <p>Total Essential Expenses</p>
              <h3>₹{formatAmount(totalExpenses)}</h3>
            </div>
          </div>
        </section>

        {/* Shortfall result */}
        {result && (
          <section
            className={`shortfall-result ${
              result.shortfall > 0
                ? "shortfall-danger"
                : "shortfall-safe"
            }`}
          >
            {result.shortfall > 0 ? (
              <>
                <h2>⚠ Financial Shortfall Detected</h2>

                <p>
                  Your available funds and expected income may not
                  be enough to cover your upcoming essential expenses.
                </p>

                <h3>
                  Estimated Shortage: ₹{formatAmount(result.shortfall)}
                </h3>

                <p className="shortfall-advice">
                  Review non-essential spending and plan how to cover
                  the shortage before your payment deadlines.
                </p>
              </>
            ) : (
              <>
                <h2>✓ Your Essential Expenses Are Covered</h2>

                <p>
                  Based on the amounts entered, you have enough
                  funds to cover your listed essential expenses.
                </p>

                <h3>
                  Remaining Balance: ₹{formatAmount(result.remaining)}
                </h3>

                <p className="shortfall-advice">
                  Consider setting aside some money for future
                  low-income periods.
                </p>
              </>
            )}
          </section>
        )}

        {/* Actual saved database records */}
        <section className="shortfall-summary">
          <h2>Saved Expense Records</h2>

          {loading ? (
            <p>Loading saved expenses...</p>
          ) : savedExpenses.length === 0 ? (
            <p>No saved expenses yet.</p>
          ) : (
            <>
              <h3>
                Total of Saved Records: ₹{formatAmount(savedTotal)}
              </h3>

              <p>
                This total includes all expense records saved to your
                account, not just expenses for the current month.
              </p>

              <div style={{ overflowX: "auto", marginTop: "15px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "10px" }}>
                        Category
                      </th>

                      <th style={{ textAlign: "left", padding: "10px" }}>
                        Amount
                      </th>

                      <th style={{ textAlign: "left", padding: "10px" }}>
                        Due Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {savedExpenses.map((item, index) => (
                      <tr key={item.id || index}>
                        <td style={{ padding: "10px" }}>
                          {item.category}
                        </td>

                        <td style={{ padding: "10px" }}>
                          ₹{formatAmount(item.amount)}
                        </td>

                        <td style={{ padding: "10px" }}>
                          {formatDate(item.due_date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        <p style={{ marginTop: "20px" }}>
          Note: Available money and expected income are estimates entered
          by you. FINORA compares these amounts with your listed essential
          expenses; it does not directly access your bank balance or predict
          future platform payments.
        </p>
      </main>
    </div>
  );
}

export default ExpenseShortfall;
