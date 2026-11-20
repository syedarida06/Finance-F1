
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ExpenseShortfall.css";

function ExpenseShortfall() {
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

  const totalExpenses = Object.values(expenses).reduce(
    (total, value) => total + (Number(value) || 0),
    0
  );

  const totalFunds =
    (Number(availableMoney) || 0) +
    (Number(expectedIncome) || 0);

  const shortfall = Math.max(0, totalExpenses - totalFunds);
  const remaining = Math.max(0, totalFunds - totalExpenses);

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;

    setExpenses((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkShortfall = (e) => {
    e.preventDefault();

    const values = [
      availableMoney,
      expectedIncome,
      ...Object.values(expenses),
    ];

    if (values.some((value) => value === "" || Number(value) < 0)) {
      alert("Please enter valid non-negative amounts in all fields.");
      return;
    }

    setResult({
      totalFunds,
      totalExpenses,
      shortfall,
      remaining,
    });
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
            <p>Enter the money you currently have and income you expect.</p>

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
                  }}
                  placeholder="e.g. 5000"
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
                  }}
                  placeholder="e.g. 8000"
                  required
                />
              </div>
            </div>
          </section>

          <section className="shortfall-section">
            <h2>Upcoming Essential Expenses</h2>
            <p>Enter the amounts you need to pay soon.</p>

            <div className="shortfall-input-grid">
              <div className="shortfall-field">
                <label>House Rent (₹)</label>
                <input
                  type="number"
                  name="rent"
                  min="0"
                  step="0.01"
                  value={expenses.rent}
                  onChange={handleExpenseChange}
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div className="shortfall-field">
                <label>Groceries (₹)</label>
                <input
                  type="number"
                  name="groceries"
                  min="0"
                  step="0.01"
                  value={expenses.groceries}
                  onChange={handleExpenseChange}
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div className="shortfall-field">
                <label>Electricity (₹)</label>
                <input
                  type="number"
                  name="electricity"
                  min="0"
                  step="0.01"
                  value={expenses.electricity}
                  onChange={handleExpenseChange}
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div className="shortfall-field">
                <label>Other Bills (₹)</label>
                <input
                  type="number"
                  name="bills"
                  min="0"
                  step="0.01"
                  value={expenses.bills}
                  onChange={handleExpenseChange}
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div className="shortfall-field">
                <label>Loan Payments (₹)</label>
                <input
                  type="number"
                  name="loan"
                  min="0"
                  step="0.01"
                  value={expenses.loan}
                  onChange={handleExpenseChange}
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div className="shortfall-field">
                <label>Other Essential Expenses (₹)</label>
                <input
                  type="number"
                  name="other"
                  min="0"
                  step="0.01"
                  value={expenses.other}
                  onChange={handleExpenseChange}
                  placeholder="Enter amount"
                  required
                />
              </div>
            </div>
          </section>

          <div className="shortfall-submit">
            <button type="submit">Check Financial Shortfall</button>
          </div>
        </form>

        <section className="shortfall-summary">
          <h2>Your Expense Overview</h2>

          <div className="shortfall-summary-grid">
            <div className="shortfall-card">
              <p>Total Available Funds</p>
              <h3>₹{totalFunds.toLocaleString("en-IN")}</h3>
            </div>

            <div className="shortfall-card">
              <p>Total Essential Expenses</p>
              <h3>₹{totalExpenses.toLocaleString("en-IN")}</h3>
            </div>
          </div>
        </section>

        {result && (
          <section
            className={`shortfall-result ${
              result.shortfall > 0 ? "shortfall-danger" : "shortfall-safe"
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
                  Estimated Shortage: ₹
                  {result.shortfall.toLocaleString("en-IN")}
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
                  Remaining Balance: ₹
                  {result.remaining.toLocaleString("en-IN")}
                </h3>
                <p className="shortfall-advice">
                  Consider setting aside some money for future
                  low-income periods.
                </p>
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default ExpenseShortfall;
