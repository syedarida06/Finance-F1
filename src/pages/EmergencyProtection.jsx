
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./EmergencyProtection.css";

function EmergencyProtection() {
  const [dailyIncome, setDailyIncome] = useState("");
  const [missedDays, setMissedDays] = useState("");
  const [emergencyType, setEmergencyType] = useState("");
  const [extraExpenses, setExtraExpenses] = useState("");
  const [result, setResult] = useState(null);

  const lostIncome =
    (Number(dailyIncome) || 0) * (Number(missedDays) || 0);

  const totalImpact = lostIncome + (Number(extraExpenses) || 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      Number(dailyIncome) < 0 ||
      Number(missedDays) < 0 ||
      Number(extraExpenses) < 0 ||
      !emergencyType
    ) {
      alert("Please enter valid details.");
      return;
    }

    setResult({
      lostIncome,
      extraExpenses: Number(extraExpenses),
      totalImpact,
    });
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
            Provide the following details to estimate your income loss.
          </p>

          <div className="emergency-field">
            <label>Reason for Work Interruption</label>
            <select
              value={emergencyType}
              onChange={(e) => {
                setEmergencyType(e.target.value);
                setResult(null);
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
              <label>Average Daily Earnings (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={dailyIncome}
                onChange={(e) => {
                  setDailyIncome(e.target.value);
                  setResult(null);
                }}
                placeholder="e.g. 800"
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
                }}
                placeholder="e.g. 3"
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
                }}
                placeholder="e.g. 2000"
                required
              />
            </div>
          </div>

          <button type="submit" className="emergency-button">
            Calculate Financial Impact
          </button>
        </form>

        <section className="emergency-calculation">
          <h2>Estimated Impact Preview</h2>

          <div className="emergency-preview-grid">
            <div className="emergency-preview-card">
              <p>Estimated Daily Earnings</p>
              <h3>₹{(Number(dailyIncome) || 0).toLocaleString("en-IN")}</h3>
            </div>

            <div className="emergency-preview-card">
              <p>Missed Working Days</p>
              <h3>{Number(missedDays) || 0} Days</h3>
            </div>
          </div>
        </section>

        {result && (
          <section className="emergency-result">
            <h2>Emergency Impact Summary</h2>

            <p className="emergency-result-type">
              Emergency Type: <strong>{emergencyType}</strong>
            </p>

            <div className="emergency-result-row">
              <span>Estimated Lost Income</span>
              <strong>
                ₹{result.lostIncome.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="emergency-result-row">
              <span>Additional Emergency Expenses</span>
              <strong>
                ₹{result.extraExpenses.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="emergency-total">
              <p>Estimated Total Financial Impact</p>
              <h3>
                ₹{result.totalImpact.toLocaleString("en-IN")}
              </h3>
            </div>

            <div className="emergency-advice">
              <h3>FINORA Recommendation</h3>
              <p>
                Consider reviewing your essential expenses and using
                available emergency savings to manage this period.
                Plan to rebuild your savings when your earnings recover.
              </p>
            </div>
          </section>
        )}

        <p className="emergency-note">
          Note: This is an estimate based on the information entered.
          It does not represent an insurance claim or guaranteed
          financial compensation.
        </p>
      </main>
    </div>
  );
}

export default EmergencyProtection;
