
import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./IncomeTracker.css";

function IncomeTracker() {
  const [earnings, setEarnings] = useState("");
  const [incentives, setIncentives] = useState("");
  const [fuel, setFuel] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const [parking, setParking] = useState("");
  const [other, setOther] = useState("");

  const [records, setRecords] = useState([]);

  // Read the selected section from the dashboard URL
  const [searchParams] = useSearchParams();

  // References for direct navigation to form sections
  const earningsSectionRef = useRef(null);
  const expensesSectionRef = useRef(null);
  const earningsInputRef = useRef(null);
  const fuelInputRef = useRef(null);

  // Automatically scroll to the requested section
  useEffect(() => {
    const tab = searchParams.get("tab");

    if (tab === "earnings") {
      earningsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      earningsInputRef.current?.focus({ preventScroll: true });
    }

    if (tab === "expenses") {
      expensesSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      fuelInputRef.current?.focus({ preventScroll: true });
    }
  }, [searchParams]);

  // Calculate current form values
  const totalEarnings =
    Number(earnings || 0) + Number(incentives || 0);

  const totalExpenses =
    Number(fuel || 0) +
    Number(maintenance || 0) +
    Number(parking || 0) +
    Number(other || 0);

  const netIncome = totalEarnings - totalExpenses;

  // Calculate recorded totals
  const totalRecordedEarnings = records.reduce(
    (sum, record) => sum + record.earnings,
    0
  );

  const totalRecordedExpenses = records.reduce(
    (sum, record) => sum + record.expenses,
    0
  );

  const totalRecordedNetIncome =
    totalRecordedEarnings - totalRecordedExpenses;

  // Save daily income record
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      earnings === "" ||
      Number(earnings) < 0 ||
      Number(incentives || 0) < 0 ||
      Number(fuel || 0) < 0 ||
      Number(maintenance || 0) < 0 ||
      Number(parking || 0) < 0 ||
      Number(other || 0) < 0
    ) {
      alert("Please enter valid amounts.");
      return;
    }

    if (totalExpenses > totalEarnings) {
      alert("Your expenses cannot exceed your total earnings.");
      return;
    }

    const newRecord = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-IN"),
      earnings: totalEarnings,
      expenses: totalExpenses,
      net: netIncome,
    };

    setRecords((prev) => [newRecord, ...prev]);

    // Clear the form after saving
    setEarnings("");
    setIncentives("");
    setFuel("");
    setMaintenance("");
    setParking("");
    setOther("");

    alert("Daily income saved successfully!");
  };

  return (
    <div className="income-page">

      {/* NAVBAR */}
      <nav className="income-navbar">
        <Link to="/user-dashboard" className="income-logo">
          FINORA
        </Link>

        <Link to="/user-dashboard" className="back-dashboard">
          ← Back to Dashboard
        </Link>
      </nav>

      <main className="income-container">

        {/* PAGE HEADING */}
        <section className="income-heading">
          <span className="income-tag">FEATURE 01</span>

          <h1>True Take-Home Income Tracker</h1>

          <p>
            Track your earnings, manage your work expenses
            and understand how much money you actually take home.
          </p>
        </section>

        {/* SUMMARY CARDS */}
        <section className="income-summary">

          <div className="income-summary-card">
            <p>Total Earnings</p>
            <h2>
              ₹{totalRecordedEarnings.toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="income-summary-card">
            <p>Total Expenses</p>
            <h2>
              ₹{totalRecordedExpenses.toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="income-summary-card net-card">
            <p>Net Income</p>
            <h2>
              ₹{totalRecordedNetIncome.toLocaleString("en-IN")}
            </h2>
          </div>

        </section>

        {/* INCOME ENTRY FORM */}
        <section className="income-form-section">

          <div className="section-title">
            <h2>Enter Your Daily Income</h2>
            <p>Add your earnings and expenses for today.</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* DAILY EARNINGS */}
            <div
              className="form-subheading"
              ref={earningsSectionRef}
            >
              <span>💰</span>
              <h3>Daily Earnings</h3>
            </div>

            <div className="income-input-grid">

              <div className="income-field">
                <label>Delivery Earnings (₹) *</label>

                <input
                  ref={earningsInputRef}
                  type="number"
                  min="0"
                  value={earnings}
                  onChange={(e) => setEarnings(e.target.value)}
                  placeholder="Enter delivery earnings"
                  required
                />
              </div>

              <div className="income-field">
                <label>Incentives / Bonuses (₹)</label>

                <input
                  type="number"
                  min="0"
                  value={incentives}
                  onChange={(e) => setIncentives(e.target.value)}
                  placeholder="Enter incentives"
                />
              </div>

            </div>

            {/* WORK-RELATED EXPENSES */}
            <div
              className="form-subheading expense-subheading"
              ref={expensesSectionRef}
            >
              <span>🧾</span>
              <h3>Work-Related Expenses</h3>
            </div>

            <div className="income-input-grid">

              <div className="income-field">
                <label>Fuel Expenses (₹)</label>

                <input
                  ref={fuelInputRef}
                  type="number"
                  min="0"
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value)}
                  placeholder="Fuel cost"
                />
              </div>

              <div className="income-field">
                <label>Vehicle Maintenance (₹)</label>

                <input
                  type="number"
                  min="0"
                  value={maintenance}
                  onChange={(e) => setMaintenance(e.target.value)}
                  placeholder="Maintenance cost"
                />
              </div>

              <div className="income-field">
                <label>Parking Expenses (₹)</label>

                <input
                  type="number"
                  min="0"
                  value={parking}
                  onChange={(e) => setParking(e.target.value)}
                  placeholder="Parking cost"
                />
              </div>

              <div className="income-field">
                <label>Other Expenses (₹)</label>

                <input
                  type="number"
                  min="0"
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  placeholder="Other work expenses"
                />
              </div>

            </div>

            {/* LIVE CALCULATION */}
            <div className="income-calculation">

              <h3>Income Calculation</h3>

              <div className="calculation-row">
                <span>Total Earnings</span>

                <strong>
                  ₹{totalEarnings.toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="calculation-row">
                <span>Total Work Expenses</span>

                <strong>
                  − ₹{totalExpenses.toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="calculation-divider"></div>

              <div className="calculation-total">
                <span>Actual Take-Home Income</span>

                <strong>
                  ₹{netIncome.toLocaleString("en-IN")}
                </strong>
              </div>

            </div>

            {/* SAVE BUTTON */}
            <button type="submit" className="save-income-btn">
              Save Daily Income
            </button>

          </form>
        </section>

        {/* INCOME HISTORY */}
        <section className="income-history">

          <div className="section-title">
            <h2>Income History</h2>
            <p>Your previously recorded daily earnings.</p>
          </div>

          {records.length === 0 ? (
            <div className="empty-income">
              <span>📊</span>

              <h3>No Income Records Yet</h3>

              <p>
                Enter your daily earnings above to start tracking
                your actual take-home income.
              </p>
            </div>
          ) : (
            <div className="income-table-wrapper">

              <table className="income-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Earnings</th>
                    <th>Expenses</th>
                    <th>Net Income</th>
                  </tr>
                </thead>

                <tbody>
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td>{record.date}</td>

                      <td>
                        ₹{record.earnings.toLocaleString("en-IN")}
                      </td>

                      <td>
                        ₹{record.expenses.toLocaleString("en-IN")}
                      </td>

                      <td className="positive-income">
                        ₹{record.net.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          )}

        </section>

      </main>

      {/* FOOTER */}
      <footer className="income-footer">
        FINORA © 2026 | Your Income. Your Stability.
      </footer>

    </div>
  );
}

export default IncomeTracker;
