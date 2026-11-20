
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./IncomeInstability.css";

const API_URL = "http://localhost:5000/api/features";

function formatAmount(value) {
  return Number(value || 0).toLocaleString("en-IN", {
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

  return "-";
}

function IncomeInstability() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [averageIncome, setAverageIncome] = useState(0);
  const [latestIncome, setLatestIncome] = useState(0);
  const [hasAlert, setHasAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIncomeAnalysis = async () => {
      const token = localStorage.getItem("finoraToken");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const [incomeResponse, stabilityResponse] = await Promise.all([
          fetch(`${API_URL}/income`, { headers }),
          fetch(`${API_URL}/income-stability`, { headers }),
        ]);

        if (
          incomeResponse.status === 401 ||
          stabilityResponse.status === 401
        ) {
          localStorage.removeItem("finoraToken");
          localStorage.removeItem("finoraUser");
          navigate("/login", { replace: true });
          return;
        }

        const incomeData = await incomeResponse.json();
        const stabilityData = await stabilityResponse.json();

        if (!incomeResponse.ok) {
          throw new Error(incomeData.message || "Unable to load income history.");
        }

        if (!stabilityResponse.ok) {
          throw new Error(stabilityData.message || "Unable to analyse income.");
        }

        const savedRecords = Array.isArray(incomeData)
          ? incomeData
          : incomeData.records || incomeData.income || [];

        const formattedRecords = savedRecords.map((item) => ({
          id: item.id,
          amount: Number(item.net_income ?? (
            Number(item.delivery_earnings || 0) +
            Number(item.incentives || 0) -
            Number(item.fuel || 0) -
            Number(item.maintenance || 0) -
            Number(item.parking || 0) -
            Number(item.mobile_data || 0) -
            Number(item.other_expenses || 0)
          )),
          date: item.record_date || item.created_at,
        }));

        formattedRecords.sort(
          (a, b) => String(a.date).localeCompare(String(b.date))
        );

        setRecords(formattedRecords);

        setAverageIncome(Number(stabilityData.average_income || 0));
        setLatestIncome(Number(stabilityData.latest_income || 0));

        // Use the backend boolean, not the alert message string.
        setHasAlert(stabilityData.has_alert === true);

      } catch (err) {
        console.error("Income stability error:", err);
        setError(err.message || "Unable to analyse your income.");
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeAnalysis();
  }, [navigate]);

  const incomeChange =
    averageIncome > 0
      ? ((latestIncome - averageIncome) / averageIncome) * 100
      : 0;

  const dailyRecordsCount = records.length;

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

        {loading ? (
          <p>Analysing your income records...</p>
        ) : error ? (
          <div className="instability-alert warning-alert">
            <h3>Unable to Analyse Income</h3>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <section className="instability-stats">
              <div className="instability-card">
                <span>Average Daily Income</span>
                <h2>₹{formatAmount(averageIncome)}</h2>
                <p>Based on recorded days in the last 30 days</p>
              </div>

              <div className="instability-card">
                <span>Latest Daily Income</span>
                <h2>₹{formatAmount(latestIncome)}</h2>
                <p>Most recently recorded day</p>
              </div>

              <div className="instability-card">
                <span>Income Change</span>
                <h2 className={incomeChange < 0 ? "drop-value" : "stable-value"}>
                  {dailyRecordsCount >= 2
                    ? `${incomeChange > 0 ? "+" : ""}${incomeChange.toFixed(1)}%`
                    : "--"}
                </h2>
                <p>Compared with your 30-day average</p>
              </div>
            </section>

            <section className="instability-alert-section">
              {hasAlert ? (
                <div className="instability-alert warning-alert">
                  <h3>⚠ Income Drop Detected</h3>
                  <p>
                    Your latest daily income is more than 30% below
                    your recent average. Review your expenses and plan
                    for upcoming essential payments.
                  </p>
                </div>
              ) : (
                <div className="instability-alert stable-alert">
                  <h3>✓ No Significant Income Drop Detected</h3>
                  <p>
                    {dailyRecordsCount < 2
                      ? "Add more daily income records through the Income Tracker to build your income history."
                      : "Your latest recorded income has not triggered the instability alert."}
                  </p>
                </div>
              )}
            </section>

            <section className="income-entry-section">
              <div className="section-title">
                <h2>Record Daily Income</h2>
                <p>
                  Your income is retrieved automatically from your saved
                  Income Tracker records.
                </p>
                <Link to="/income-tracker" className="instability-back">
                  Go to Income Tracker →
                </Link>
              </div>
            </section>

            <section className="income-history-section">
              <div className="section-title">
                <h2>Income History</h2>
                <p>Your saved daily net earnings.</p>
              </div>

              {records.length === 0 ? (
                <div className="empty-income">
                  <p>No income records yet.</p>
                  <span>
                    Add your first daily income through the Income Tracker.
                  </span>
                </div>
              ) : (
                <div className="income-table-wrapper">
                  <table className="income-history-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Daily Net Income</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record, index) => (
                        <tr key={record.id || `${record.date}-${index}`}>
                          <td>{formatDate(record.date)}</td>
                          <td>₹{formatAmount(record.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        <p className="instability-note">
          Note: FINORA analyses your saved daily income records over the
          last 30 days. An alert is generated when the latest daily income
          is more than 30% below the average.
        </p>
      </main>
    </div>
  );
}

export default IncomeInstability;
