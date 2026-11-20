
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./IncomeSimulator.css";

function IncomeSimulator() {
  const [expectedIncome, setExpectedIncome] = useState("");
  const [workExpenses, setWorkExpenses] = useState("");
  const [rent, setRent] = useState("");
  const [groceries, setGroceries] = useState("");
  const [bills, setBills] = useState("");
  const [loan, setLoan] = useState("");
  const [otherExpenses, setOtherExpenses] = useState("");
  const [simulated, setSimulated] = useState(false);

  const number = (value) => Number(value || 0);

  const takeHomeIncome =
    number(expectedIncome) - number(workExpenses);

  const essentialExpenses =
    number(rent) +
    number(groceries) +
    number(bills) +
    number(loan) +
    number(otherExpenses);

  const remainingMoney = takeHomeIncome - essentialExpenses;

  const shortfall = Math.max(0, -remainingMoney);
  const suggestedSavings =
    remainingMoney > 0 ? Math.round(remainingMoney * 0.2) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    const values = [
      expectedIncome,
      workExpenses,
      rent,
      groceries,
      bills,
      loan,
      otherExpenses,
    ];

    if (
      values.some(
        (value) => value === "" || !Number.isFinite(Number(value)) || Number(value) < 0
      )
    ) {
      alert("Please enter valid non-negative amounts in all fields.");
      return;
    }

    setSimulated(true);
  };

  const handleReset = () => {
    setExpectedIncome("");
    setWorkExpenses("");
    setRent("");
    setGroceries("");
    setBills("");
    setLoan("");
    setOtherExpenses("");
    setSimulated(false);
  };

  const formatMoney = (amount) =>
    `₹${amount.toLocaleString("en-IN")}`;

  return (
    <div className="simulator-page">

      {/* NAVBAR */}
      <nav className="simulator-navbar">
        <Link to="/user-dashboard" className="simulator-logo">
          FINORA<span>.</span>
        </Link>

        <Link to="/user-dashboard" className="simulator-back">
          ← Back to Dashboard
        </Link>
      </nav>

      <main className="simulator-container">

        {/* HEADING */}
        <section className="simulator-heading">
          <span className="simulator-tag">FINANCIAL PLANNING TOOL</span>

          <h1>Income Simulator</h1>

          <p>
            Plan for changing income. Estimate your monthly earnings,
            account for essential expenses and see whether you can
            comfortably manage a low-income month.
          </p>
        </section>

        {/* INPUT FORM */}
        <section className="simulator-card">

          <div className="simulator-section-title">
            <span>01</span>
            <div>
              <h2>Enter Your Monthly Estimates</h2>
              <p>Use realistic amounts to understand your financial position.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="simulator-form-group">
              <h3>Monthly Income</h3>

              <div className="simulator-input-grid">

                <div className="simulator-field">
                  <label>Expected Monthly Earnings (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={expectedIncome}
                    onChange={(e) => {
                      setExpectedIncome(e.target.value);
                      setSimulated(false);
                    }}
                    placeholder="e.g. 25000"
                    required
                  />
                </div>

                <div className="simulator-field">
                  <label>Work-Related Expenses (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={workExpenses}
                    onChange={(e) => {
                      setWorkExpenses(e.target.value);
                      setSimulated(false);
                    }}
                    placeholder="e.g. 4000"
                    required
                  />
                </div>

              </div>
            </div>

            <div className="simulator-form-group">
              <h3>Essential Monthly Expenses</h3>

              <div className="simulator-input-grid">

                <div className="simulator-field">
                  <label>House Rent (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={rent}
                    onChange={(e) => {
                      setRent(e.target.value);
                      setSimulated(false);
                    }}
                    placeholder="e.g. 6000"
                    required
                  />
                </div>

                <div className="simulator-field">
                  <label>Groceries (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={groceries}
                    onChange={(e) => {
                      setGroceries(e.target.value);
                      setSimulated(false);
                    }}
                    placeholder="e.g. 4000"
                    required
                  />
                </div>

                <div className="simulator-field">
                  <label>Electricity & Other Bills (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={bills}
                    onChange={(e) => {
                      setBills(e.target.value);
                      setSimulated(false);
                    }}
                    placeholder="e.g. 1500"
                    required
                  />
                </div>

                <div className="simulator-field">
                  <label>Loan / EMI Payments (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={loan}
                    onChange={(e) => {
                      setLoan(e.target.value);
                      setSimulated(false);
                    }}
                    placeholder="e.g. 2000"
                    required
                  />
                </div>

                <div className="simulator-field">
                  <label>Other Essential Expenses (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={otherExpenses}
                    onChange={(e) => {
                      setOtherExpenses(e.target.value);
                      setSimulated(false);
                    }}
                    placeholder="e.g. 1000"
                    required
                  />
                </div>

              </div>
            </div>

            <div className="simulator-actions">
              <button type="submit" className="simulate-btn">
                Simulate My Income
              </button>

              <button
                type="button"
                className="reset-simulator-btn"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>

          </form>
        </section>

        {/* RESULTS */}
        <section className="simulator-results">

          <div className="simulator-section-title">
            <span>02</span>
            <div>
              <h2>Your Financial Projection</h2>
              <p>
                {simulated
                  ? "Here is your estimated monthly financial position."
                  : "Enter your estimates and simulate your monthly finances."}
              </p>
            </div>
          </div>

          <div className="simulator-result-grid">

            <div className="simulator-result-card">
              <p>Take-Home Income</p>
              <h3>{formatMoney(takeHomeIncome)}</h3>
              <span>After work-related expenses</span>
            </div>

            <div className="simulator-result-card">
              <p>Essential Expenses</p>
              <h3>{formatMoney(essentialExpenses)}</h3>
              <span>Your estimated monthly commitments</span>
            </div>

            <div className="simulator-result-card">
              <p>Remaining Money</p>
              <h3 className={remainingMoney < 0 ? "negative-value" : "positive-value"}>
                {formatMoney(remainingMoney)}
              </h3>
              <span>After essential expenses</span>
            </div>

          </div>

          {simulated && (
            <div className={`simulator-feedback ${
              shortfall > 0 ? "shortfall-feedback" : "stable-feedback"
            }`}>

              {shortfall > 0 ? (
                <>
                  <h3>⚠️ Possible Monthly Shortfall</h3>
                  <p>
                    Your estimated take-home income is not enough
                    to cover your essential expenses.
                  </p>
                  <strong>
                    Estimated shortfall: {formatMoney(shortfall)}
                  </strong>
                  <p>
                    Consider reviewing non-essential spending,
                    planning additional work where possible, or using
                    an existing emergency reserve carefully.
                  </p>
                </>
              ) : (
                <>
                  <h3>✓ Your Estimated Expenses Are Covered</h3>
                  <p>
                    Your expected take-home income covers your
                    estimated essential expenses.
                  </p>
                  <strong>
                    Suggested savings: {formatMoney(suggestedSavings)}
                  </strong>
                  <p>
                    This is a suggested 20% of your remaining money.
                    Consider setting it aside for future low-income months.
                  </p>
                </>
              )}

            </div>
          )}

          {!simulated && (
            <div className="simulator-empty">
              <span>📊</span>
              <p>Your financial projection will appear here after simulation.</p>
            </div>
          )}

        </section>

        {/* INFORMATION */}
        <section className="simulator-tip">
          <span>✦</span>
          <div>
            <h3>Plan Ahead for Lean Months</h3>
            <p>
              Your income may change from month to month. Use this
              simulator to explore different earning scenarios and
              prepare for months when your earnings may be lower.
            </p>
          </div>
        </section>

      </main>

      <footer className="simulator-footer">
        FINORA © 2026 | Your Income. Your Stability.
      </footer>

    </div>
  );
}

export default IncomeSimulator;
