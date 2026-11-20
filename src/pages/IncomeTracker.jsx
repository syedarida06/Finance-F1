
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./IncomeTracker.css";

const API_URL = "http://localhost:5000/api/features";

function formatAmount(value) {
  const amount = Number(value || 0);

  return (Number.isFinite(amount) ? amount : 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

function formatDate(date) {
  if (!date) return "-";

  const datePart = String(date).split("T")[0];
  const parts = datePart.split("-");

  if (parts.length === 3) {
    return new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    ).toLocaleDateString("en-IN");
  }

  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? "-"
    : parsed.toLocaleDateString("en-IN");
}

function normalizeRecord(record) {
  const delivery = Number(record.delivery_earnings || 0);
  const incentives = Number(record.incentives || 0);

  const expenses =
    Number(record.fuel || 0) +
    Number(record.maintenance || 0) +
    Number(record.parking || 0) +
    Number(record.mobile_data || 0) +
    Number(record.other_expenses || 0);

  return {
    id: record.id,
    date: formatDate(record.record_date),
    earnings: delivery + incentives,
    expenses,
    net: delivery + incentives - expenses,
  };
}

function IncomeTracker() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [earnings, setEarnings] = useState("");
  const [incentives, setIncentives] = useState("");
  const [fuel, setFuel] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const [parking, setParking] = useState("");
  const [mobileData, setMobileData] = useState("");
  const [other, setOther] = useState("");

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const earningsSectionRef = useRef(null);
  const expensesSectionRef = useRef(null);
  const earningsInputRef = useRef(null);
  const fuelInputRef = useRef(null);

  // Fetch real income records belonging to the logged-in user
  const fetchRecords = async () => {
    const token = localStorage.getItem("finoraToken");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const response = await fetch(`${API_URL}/income`, {
      method: "GET",
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
      throw new Error(data.message || "Unable to load income records.");
    }

    const savedRecords = Array.isArray(data)
      ? data
      : data.records || data.income || data.data || [];

    if (!Array.isArray(savedRecords)) {
      throw new Error("Invalid income records received from the server.");
    }

    setRecords(savedRecords.map(normalizeRecord));
  };

  // Load records when the page opens
  useEffect(() => {
    const loadRecords = async () => {
      try {
        await fetchRecords();
      } catch (err) {
        setError(err.message || "Could not load income records.");
      } finally {
        setLoading(false);
      }
    };

    loadRecords();
  }, [navigate]);

  // Dashboard quick-action navigation
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

  // Live calculation using the current form entries
  const totalEarnings =
    Number(earnings || 0) + Number(incentives || 0);

  const totalExpenses =
    Number(fuel || 0) +
    Number(maintenance || 0) +
    Number(parking || 0) +
    Number(mobileData || 0) +
    Number(other || 0);

  const netIncome = totalEarnings - totalExpenses;

  // Totals calculated from actual database records
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

  // Save a new daily income record
  const handleSubmit = async (e) => {
    e.preventDefault();

    const values = [
      earnings,
      incentives,
      fuel,
      maintenance,
      parking,
      mobileData,
      other,
    ];

    const hasInvalidAmount = values.some(
      (value) =>
        value !== "" &&
        (!Number.isFinite(Number(value)) || Number(value) < 0)
    );

    if (earnings.trim() === "" || hasInvalidAmount) {
      setError("Enter valid non-negative amounts. Delivery earnings are required.");
      return;
    }

    const token = localStorage.getItem("finoraToken");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const today = new Date();

      const localDate = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
      ].join("-");

      const payload = {
        record_date: localDate,
        delivery_earnings: Number(earnings),
        incentives: Number(incentives || 0),
        fuel: Number(fuel || 0),
        maintenance: Number(maintenance || 0),
        parking: Number(parking || 0),
        mobile_data: Number(mobileData || 0),
        other_expenses: Number(other || 0),
      };

      const response = await fetch(`${API_URL}/income`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        localStorage.removeItem("finoraToken");
        localStorage.removeItem("finoraUser");
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to save income.");
      }

      // Clear the form after the backend confirms the save
      setEarnings("");
      setIncentives("");
      setFuel("");
      setMaintenance("");
      setParking("");
      setMobileData("");
      setOther("");

      setSuccess("Daily income saved successfully!");

      // Refresh the actual database records
      try {
        await fetchRecords();
      } catch (refreshError) {
        setError(
          "Your income was saved, but the history could not be refreshed. Reload the page to see it."
        );
      }
    } catch (err) {
      setError(err.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="income-page">
      <nav className="income-navbar">
        <Link to="/user-dashboard" className="income-logo">
          FINORA
        </Link>

        <Link to="/user-dashboard" className="back-dashboard">
          ← Back to Dashboard
        </Link>
      </nav>

      <main className="income-container">
        <section className="income-heading">
          <span className="income-tag">FEATURE 01</span>

          <h1>True Take-Home Income Tracker</h1>

          <p>
            Track your earnings, manage your work expenses
            and understand how much money you actually take home.
          </p>
        </section>

        {/* Actual saved totals from PostgreSQL */}
        <section className="income-summary">
          <div className="income-summary-card">
            <p>Total Recorded Earnings</p>
            <h2>₹{formatAmount(totalRecordedEarnings)}</h2>
          </div>

          <div className="income-summary-card">
            <p>Total Recorded Expenses</p>
            <h2>₹{formatAmount(totalRecordedExpenses)}</h2>
          </div>

          <div className="income-summary-card net-card">
            <p>Total Recorded Net Income</p>
            <h2>₹{formatAmount(totalRecordedNetIncome)}</h2>
          </div>
        </section>

        {/* Daily income form */}
        <section className="income-form-section">
          <div className="section-title">
            <h2>Enter Your Daily Income</h2>
            <p>Add your earnings and expenses for today.</p>
          </div>

          <form onSubmit={handleSubmit}>
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
                  step="0.01"
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
                  step="0.01"
                  value={incentives}
                  onChange={(e) => setIncentives(e.target.value)}
                  placeholder="Enter incentives"
                />
              </div>
            </div>

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
                  step="0.01"
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
                  step="0.01"
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
                  step="0.01"
                  value={parking}
                  onChange={(e) => setParking(e.target.value)}
                  placeholder="Parking cost"
                />
              </div>

              <div className="income-field">
                <label>Mobile Data Expenses (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={mobileData}
                  onChange={(e) => setMobileData(e.target.value)}
                  placeholder="Mobile data cost"
                />
              </div>

              <div className="income-field">
                <label>Other Expenses (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  placeholder="Other work expenses"
                />
              </div>
            </div>

            {/* Live calculation from current form entries */}
            <div className="income-calculation">
              <h3>Income Calculation</h3>

              <div className="calculation-row">
                <span>Total Earnings</span>
                <strong>₹{formatAmount(totalEarnings)}</strong>
              </div>

              <div className="calculation-row">
                <span>Total Work Expenses</span>
                <strong>− ₹{formatAmount(totalExpenses)}</strong>
              </div>

              <div className="calculation-divider"></div>

              <div className="calculation-total">
                <span>Actual Take-Home Income</span>
                <strong>₹{formatAmount(netIncome)}</strong>
              </div>
            </div>

            <button
              type="submit"
              className="save-income-btn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Daily Income"}
            </button>
          </form>
        </section>

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

        {/* Database-backed income history */}
        <section className="income-history">
          <div className="section-title">
            <h2>Income History</h2>
            <p>Your previously recorded daily earnings.</p>
          </div>

          {loading ? (
            <div className="empty-income">
              <p>Loading your income records...</p>
            </div>
          ) : records.length === 0 ? (
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
                  {records.map((record, index) => (
                    <tr key={record.id || `${record.date}-${index}`}>
                      <td>{record.date}</td>
                      <td>₹{formatAmount(record.earnings)}</td>
                      <td>₹{formatAmount(record.expenses)}</td>
                      <td className={record.net >= 0 ? "positive-income" : ""}>
                        ₹{formatAmount(record.net)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <footer className="income-footer">
        FINORA © 2026 | Your Income. Your Stability.
      </footer>
    </div>
  );
}

export default IncomeTracker;
