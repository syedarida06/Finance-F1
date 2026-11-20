
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./EmergencyProtection.css";

const API_URL = "http://localhost:5000/api/features";

function formatAmount(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("en-IN");
}

function EmergencyProtection() {
  const navigate = useNavigate();

  const [dailyIncome, setDailyIncome] = useState("");
  const [missedDays, setMissedDays] = useState("");
  const [emergencyType, setEmergencyType] = useState("");
  const [extraExpenses, setExtraExpenses] = useState("");

  const [result, setResult] = useState(null);
  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Retrieve the user's saved emergency records
  const fetchRecords = async () => {
    const token = localStorage.getItem("finoraToken");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const response = await fetch(`${API_URL}/interruption`, {
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
      throw new Error(data.message || "Unable to load emergency records.");
    }

    const savedRecords = Array.isArray(data)
      ? data
      : data.records || data.interruptions || data.data || [];

    if (!Array.isArray(savedRecords)) {
      throw new Error("Invalid emergency records received.");
    }

    setRecords(savedRecords);
  };

  // Retrieve average daily take-home income from saved income history
  const fetchAverageIncome = async () => {
    const token = localStorage.getItem("finoraToken");

    if (!token) return;

    const response = await fetch(`${API_URL}/income-stability`, {
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
      throw new Error(data.message || "Unable to retrieve income analysis.");
    }

    const average = Number(data.average_income || 0);

    if (average > 0) {
      setDailyIncome(average.toFixed(2));
    }
  };

  // Load history and income estimate when the page opens
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchRecords(),
          fetchAverageIncome(),
        ]);
      } catch (err) {
        setError(err.message || "Unable to load your emergency information.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const lostIncome =
    (Number(dailyIncome) || 0) * (Number(missedDays) || 0);

  const totalImpact =
    lostIncome + (Number(extraExpenses) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setResult(null);

    if (
      !emergencyType ||
      dailyIncome.trim() === "" ||
      missedDays.trim() === "" ||
      extraExpenses.trim() === "" ||
      !Number.isFinite(Number(dailyIncome)) ||
      !Number.isFinite(Number(missedDays)) ||
      !Number.isFinite(Number(extraExpenses)) ||
      Number(dailyIncome) < 0 ||
      Number(missedDays) < 1 ||
      !Number.isInteger(Number(missedDays)) ||
      Number(extraExpenses) < 0
    ) {
      setError("Please enter valid emergency details and non-negative amounts.");
      return;
    }

    const token = localStorage.getItem("finoraToken");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/interruption`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: emergencyType,
          average_daily_income: Number(dailyIncome),
          missed_days: Number(missedDays),
          additional_expenses: Number(extraExpenses),
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
        throw new Error(data.message || "Unable to save emergency record.");
      }

      setResult({
        lostIncome: Number(
          data.estimated_lost_income ?? lostIncome
        ),
        extraExpenses: Number(extraExpenses),
        totalImpact: Number(
          data.estimated_total_impact ?? totalImpact
        ),
        reason: emergencyType,
      });

      setSuccess("Emergency details saved successfully.");

      // Refresh saved history after successful database insertion
      try {
        await fetchRecords();
      } catch (refreshError) {
        setError(
          "Your emergency record was saved, but history could not be refreshed. Reload the page to see it."
        );
      }
    } catch (err) {
      console.error("Emergency saving error:", err);
      setError(err.message || "Unable to save emergency details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="emergency-page">
      <nav className="emergency-navbar">
        <Link to="/user-dashboard" className="emergency-logo">
          FINORA<span>.</span>
        </Link>

        <Link to="/user-dashboard" className="emergency-back">
          ← Back to Dashboard
        </Link>
      </nav>

      <main className="emergency-container">
        <header className="emergency-heading">
          <p className="emergency-tag">EMERGENCY FINANCIAL PLANNING</p>

          <h1>Workday Loss & Emergency Protection</h1>

          <p>
            Understand the financial impact of unexpected work
            interruptions and prepare for the days you cannot work.
          </p>
        </header>

        <section className="emergency-info">
          <div className="emergency-info-icon">🛡️</div>

          <div>
            <h3>Be Prepared for Unexpected Situations</h3>

            <p>
              Illness, vehicle breakdowns, accidents, or other
              unexpected events can interrupt your daily earnings.
              FINORA helps estimate the financial impact.
            </p>
          </div>
        </section>

        <form className="emergency-form" onSubmit={handleSubmit}>
          <h2>Enter Your Work Details</h2>

          <p className="emergency-description">
            Your average daily take-home income is retrieved from your
            saved income history when available. You can adjust it.
          </p>

          <div className="emergency-field">
            <label>Reason for Work Interruption</label>

            <select
              value={emergencyType}
              onChange={(e) => {
                setEmergencyType(e.target.value);
                setResult(null);
                setError("");
                setSuccess("");
              }}
              required
            >
              <option value="">Select an emergency</option>
              <option value="Illness">Illness</option>
              <option value="Vehicle Breakdown">Vehicle Breakdown</option>
              <option value="Accident">Accident</option>
              <option value="Bad Weather">Bad Weather</option>
              <option value="Other">Other Unexpected Reason</option>
            </select>
          </div>

          <div className="emergency-grid">
            <div className="emergency-field">
              <label>Average Daily Take-Home Income (₹)</label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={dailyIncome}
                onChange={(e) => {
                  setDailyIncome(e.target.value);
                  setResult(null);
                  setError("");
                  setSuccess("");
                }}
                placeholder="Enter average daily income"
                required
              />
            </div>

            <div className="emergency-field">
              <label>Number of Missed Working Days</label>

              <input
                type="number"
                min="1"
                step="1"
                value={missedDays}
                onChange={(e) => {
                  setMissedDays(e.target.value);
                  setResult(null);
                  setError("");
                  setSuccess("");
                }}
                placeholder="Enter missed days"
                required
              />
            </div>

            <div className="emergency-field emergency-full">
              <label>Additional Emergency Expenses (₹)</label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={extraExpenses}
                onChange={(e) => {
                  setExtraExpenses(e.target.value);
                  setResult(null);
                  setError("");
                  setSuccess("");
                }}
                placeholder="Enter additional expenses (enter 0 if none)"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="emergency-button"
            disabled={saving}
          >
            {saving ? "Saving..." : "Calculate Financial Impact"}
          </button>
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

        {/* Live estimate based on entered values */}
        <section className="emergency-calculation">
          <h2>Estimated Impact Preview</h2>

          <div className="emergency-preview-grid">
            <div className="emergency-preview-card">
              <p>Estimated Daily Take-Home Income</p>
              <h3>₹{formatAmount(dailyIncome)}</h3>
            </div>

            <div className="emergency-preview-card">
              <p>Missed Working Days</p>
              <h3>{Number(missedDays) || 0} Days</h3>
            </div>
          </div>

          <div className="emergency-preview-grid">
            <div className="emergency-preview-card">
              <p>Estimated Lost Income</p>
              <h3>₹{formatAmount(lostIncome)}</h3>
            </div>

            <div className="emergency-preview-card">
              <p>Estimated Total Impact</p>
              <h3>₹{formatAmount(totalImpact)}</h3>
            </div>
          </div>
        </section>

        {/* Saved calculation returned by the backend */}
        {result && (
          <section className="emergency-result">
            <h2>Emergency Impact Summary</h2>

            <p className="emergency-result-type">
              Emergency Type: <strong>{result.reason}</strong>
            </p>

            <div className="emergency-result-row">
              <span>Estimated Lost Income</span>
              <strong>₹{formatAmount(result.lostIncome)}</strong>
            </div>

            <div className="emergency-result-row">
              <span>Additional Emergency Expenses</span>
              <strong>₹{formatAmount(result.extraExpenses)}</strong>
            </div>

            <div className="emergency-total">
              <p>Estimated Total Financial Impact</p>
              <h3>₹{formatAmount(result.totalImpact)}</h3>
            </div>

            <div className="emergency-advice">
              <h3>FINORA Recommendation</h3>

              <p>
                Review your essential expenses and consider using
                available emergency savings to manage this period.
                Plan to rebuild your savings when your earnings recover.
              </p>
            </div>
          </section>
        )}

        {/* Actual saved emergency history */}
        <section className="emergency-calculation">
          <h2>Previous Emergency Records</h2>

          {loading ? (
            <p>Loading emergency records...</p>
          ) : records.length === 0 ? (
            <p>No emergency records saved yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "10px" }}>
                      Date
                    </th>
                    <th style={{ textAlign: "left", padding: "10px" }}>
                      Reason
                    </th>
                    <th style={{ textAlign: "left", padding: "10px" }}>
                      Daily Income
                    </th>
                    <th style={{ textAlign: "left", padding: "10px" }}>
                      Missed Days
                    </th>
                    <th style={{ textAlign: "left", padding: "10px" }}>
                      Estimated Total Impact
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {records.map((record, index) => {
                    const lost =
                      Number(record.average_daily_income || 0) *
                      Number(record.missed_days || 0);

                    const extra = Number(record.additional_expenses || 0);

                    return (
                      <tr key={record.id || index}>
                        <td style={{ padding: "10px" }}>
                          {formatDate(record.created_at)}
                        </td>

                        <td style={{ padding: "10px" }}>
                          {record.reason}
                        </td>

                        <td style={{ padding: "10px" }}>
                          ₹{formatAmount(record.average_daily_income)}
                        </td>

                        <td style={{ padding: "10px" }}>
                          {record.missed_days}
                        </td>

                        <td style={{ padding: "10px" }}>
                          ₹{formatAmount(lost + extra)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="emergency-note">
          Note: This is an estimate based on saved income analysis and
          the information entered. It does not represent an insurance
          claim, guaranteed financial compensation, or an actual payout.
        </p>
      </main>
    </div>
  );
}

export default EmergencyProtection;
