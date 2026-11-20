
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./IncomeInstability.css";

function IncomeInstability() {
  const [income, setIncome] = useState("");
  const [records, setRecords] = useState([]);

  const averageIncome =
    records.length > 0
      ? records.reduce((total, item) => total + item.amount, 0) /
        records.length
      : 0;

  const latestIncome =
    records.length > 0 ? records[records.length - 1].amount : 0;

  const incomeDrop =
    averageIncome > 0
      ? ((averageIncome - latestIncome) / averageIncome) * 100
      : 0;

  const hasAlert = records.length >= 2 && incomeDrop >= 20;

  const addIncome = (e) => {
    e.preventDefault();

    const amount = Number(income);

    if (!income || amount <= 0) {
      alert("Please enter a valid daily income.");
      return;
    }

    const newRecord = {
      id: Date.now(),
      amount,
      date: new Date().toLocaleDateString("en-IN"),
    };

    setRecords([...records, newRecord]);
    setIncome("");
  };

  return (
    <div className="instability-page">
      <nav className="instability-navbar">
        <Link to="/user-dashboard" className="instability-logo">
          FINORA
        </Link>

        <Link to="/user-dashboard" className="instability-back">
          ← Back to Dashboard
        </Link>
      </nav>

      <main className="instability-container">
        <section className="instability-heading">
          <span className="instability-tag">INCOME PROTECTION</span>
          <h1>Income Instability Alert</h1>
          <p>
            Understand changes in your daily earnings and identify
            sudden income drops before they affect your financial stability.
          </p>
        </section>

        <section className="instability-stats">
          <div className="instability-card">
            <span>Average Daily Income</span>
            <h2>₹{averageIncome.toFixed(0)}</h2>
            <p>Based on your recorded entries</p>
          </div>

          <div className="instability-card">
            <span>Latest Daily Income</span>
            <h2>₹{latestIncome.toFixed(0)}</h2>
            <p>Most recently recorded income</p>
          </div>

          <div className="instability-card">
            <span>Income Change</span>
            <h2 className={incomeDrop > 0 ? "drop-value" : "stable-value"}>
              {records.length >= 2
                ? `${incomeDrop > 0 ? "-" : "+"}${Math.abs(incomeDrop).toFixed(1)}%`
                : "--"}
            </h2>
            <p>Compared with your average</p>
          </div>
        </section>

        <section className="instability-alert-section">
          {hasAlert ? (
            <div className="instability-alert warning-alert">
              <h3>⚠ Income Drop Detected</h3>
              <p>
                Your latest recorded income is{" "}
                {incomeDrop.toFixed(1)}% below your average.
                Consider reviewing your expenses and planning for
                upcoming essential payments.
              </p>
            </div>
          ) : (
            <div className="instability-alert stable-alert">
              <h3>✓ No Significant Income Drop Detected</h3>
              <p>
                {records.length < 2
                  ? "Add at least two daily income records to start analysing your income pattern."
                  : "Your latest income has not fallen by 20% or more compared with your recorded average."}
              </p>
            </div>
          )}
        </section>

        <section className="income-entry-section">
          <div className="section-title">
            <h2>Record Daily Income</h2>
            <p>Enter your total earnings for each working day.</p>
          </div>

          <form onSubmit={addIncome} className="income-entry-form">
            <div className="income-input-group">
              <label htmlFor="dailyIncome">Daily Income (₹)</label>
              <input
                id="dailyIncome"
                type="number"
                min="1"
                step="0.01"
                placeholder="Example: 850"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                required
              />
            </div>

            <button type="submit">Add Income Record</button>
          </form>
        </section>

        <section className="income-history-section">
          <div className="section-title">
            <h2>Income History</h2>
            <p>Your recorded daily earnings.</p>
          </div>

          {records.length === 0 ? (
            <div className="empty-income">
              <p>No income records yet.</p>
              <span>Add your first daily income above to begin.</span>
            </div>
          ) : (
            <div className="income-table-wrapper">
              <table className="income-history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Daily Income</th>
                  </tr>
                </thead>

                <tbody>
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td>{record.date}</td>
                      <td>₹{record.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="instability-note">
          Note: This is an initial income-monitoring prototype. Its
          analysis uses the records entered on this page and is not yet
          connected to a database.
        </p>
      </main>
    </div>
  );
}

export default IncomeInstability;
