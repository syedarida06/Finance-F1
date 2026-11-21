
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CreditBridge.css";

const API_URL = "http://localhost:5000/api";

const formatMoney = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

const formatMonth = (month) => {
  if (!month) return "Month unavailable";

  const date = new Date(`${month}-01T00:00:00`);

  if (Number.isNaN(date.getTime())) return month;

  return date.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric"
  });
};

function CreditBridge() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCreditProfile = async () => {
      const token = localStorage.getItem("finoraToken");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const [creditResponse, userResponse] = await Promise.all([
          fetch(`${API_URL}/features/credit-bridge`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          fetch(`${API_URL}/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);

        if (
          creditResponse.status === 401 ||
          userResponse.status === 401
        ) {
          localStorage.removeItem("finoraToken");
          localStorage.removeItem("finoraUser");
          navigate("/login", { replace: true });
          return;
        }

        if (!creditResponse.ok || !userResponse.ok) {
          throw new Error("Unable to load your financial profile.");
        }

        const creditData = await creditResponse.json();
        const userData = await userResponse.json();

        setProfile(creditData);
        setUser(userData.user || null);

      } catch (err) {
        console.error("CreditBridge error:", err);
        setError(
          "Unable to load your financial profile. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCreditProfile();
  }, [navigate]);

  const handlePrint = () => {
    window.print();
  };

  const incomeHistory = profile?.income_history || [];

  const hasIncomeData = incomeHistory.length > 0;

  const consistency = profile?.income_consistency;

  const getConsistencyLabel = () => {
    if (consistency === null || consistency === undefined) {
      return "Not enough data";
    }

    if (consistency >= 75) return "High consistency";
    if (consistency >= 45) return "Moderate consistency";

    return "Variable income";
  };

  if (loading) {
    return (
      <div className="creditbridge-page">
        <div className="creditbridge-loading">
          <div className="creditbridge-loader"></div>
          <h2>Preparing your financial profile...</h2>
          <p>Retrieving your saved FINORA financial records.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="creditbridge-page">
        <div className="creditbridge-error">
          <span>⚠️</span>
          <h2>Unable to load CreditBridge</h2>
          <p>{error}</p>

          <button onClick={() => window.location.reload()}>
            Try Again
          </button>

          <Link to="/user-dashboard">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="creditbridge-page">

      {/* NAVIGATION */}
      <nav className="creditbridge-navbar no-print">
        <Link to="/user-dashboard" className="creditbridge-logo">
          FINORA<span>.</span>
        </Link>

        <div className="creditbridge-nav-actions">
          <Link to="/user-dashboard">
            ← Back to Dashboard
          </Link>

          <button onClick={handlePrint}>
            ⬇ Download / Print Profile
          </button>
        </div>
      </nav>

      <main className="creditbridge-main">

        {/* PAGE HEADER */}
        <section className="creditbridge-hero">
          <div className="creditbridge-hero-content">
            <span className="creditbridge-eyebrow">
              FINORA FINANCIAL PROFILE
            </span>

            <h1>
              Credit<span>Bridge</span>
            </h1>

            <p>
              Your financial activity, organised into a profile
              that helps communicate your earnings and financial
              consistency beyond traditional salary records.
            </p>
          </div>

          <div className="creditbridge-hero-icon">
            📄
          </div>
        </section>

        {/* PROFILE IDENTITY */}
        <section className="creditbridge-identity">
          <div className="creditbridge-avatar">
            {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="creditbridge-identity-details">
            <h2>{user?.full_name || "FINORA Member"}</h2>
            <p>{user?.email || "Email not available"}</p>
            <span>FINORA Delivery Partner</span>
          </div>

          <div className="creditbridge-status">
            <span className="status-dot"></span>
            Financial profile generated
          </div>
        </section>

        {/* SUMMARY METRICS */}
        <section className="creditbridge-section">
          <div className="creditbridge-section-heading">
            <span className="creditbridge-eyebrow">
              YOUR FINANCIAL SNAPSHOT
            </span>
            <h2>Financial Overview</h2>
            <p>
              Calculated from your saved FINORA records.
            </p>
          </div>

          <div className="creditbridge-metrics">

            <div className="creditbridge-metric income-metric">
              <span className="metric-icon">💰</span>
              <span className="metric-label">
                AVERAGE MONTHLY TAKE-HOME
              </span>
              <h3>
                {formatMoney(profile?.average_monthly_income)}
              </h3>
              <p>Average net income across months with records</p>
            </div>

            <div className="creditbridge-metric expense-metric">
              <span className="metric-icon">🚴</span>
              <span className="metric-label">
                AVERAGE MONTHLY WORK EXPENSES
              </span>
              <h3>
                {formatMoney(profile?.average_monthly_work_expenses)}
              </h3>
              <p>Fuel, maintenance and other work expenses</p>
            </div>

            <div className="creditbridge-metric consistency-metric">
              <span className="metric-icon">📊</span>
              <span className="metric-label">
                INCOME CONSISTENCY
              </span>
              <h3>
                {consistency === null || consistency === undefined
                  ? "N/A"
                  : `${Number(consistency).toFixed(1)}%`}
              </h3>
              <p>{getConsistencyLabel()}</p>
            </div>

            <div className="creditbridge-metric fund-metric">
              <span className="metric-icon">🛡️</span>
              <span className="metric-label">
                PROTECTION FUND
              </span>
              <h3>
                {formatMoney(profile?.protection_fund_balance)}
              </h3>
              <p>Current recorded available fund balance</p>
            </div>

          </div>
        </section>

        {/* INCOME HISTORY */}
        <section className="creditbridge-section">
          <div className="creditbridge-section-heading">
            <span className="creditbridge-eyebrow">
              SIX-MONTH RECORD
            </span>
            <h2>Monthly Income History</h2>
            <p>
              Your recorded earnings, work expenses and take-home income.
            </p>
          </div>

          {hasIncomeData ? (
            <div className="creditbridge-table-wrapper">
              <table className="creditbridge-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Gross Earnings</th>
                    <th>Work Expenses</th>
                    <th>Net Income</th>
                    <th>Records</th>
                  </tr>
                </thead>

                <tbody>
                  {incomeHistory.map((item, index) => (
                    <tr key={`${item.month}-${index}`}>
                      <td>{formatMonth(item.month)}</td>
                      <td>{formatMoney(item.gross_income)}</td>
                      <td>{formatMoney(item.work_expenses)}</td>
                      <td className={
                        Number(item.net_income || 0) >= 0
                          ? "creditbridge-positive"
                          : "creditbridge-negative"
                      }>
                        {formatMoney(item.net_income)}
                      </td>
                      <td>{item.record_count || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="creditbridge-empty">
              <span>📊</span>
              <h3>No income history available</h3>
              <p>
                Start recording your daily delivery earnings
                to build your financial history.
              </p>

              <Link to="/income-tracker">
                + Record Income
              </Link>
            </div>
          )}

          <p className="creditbridge-data-note">
            Months without saved income records are not included
            in the monthly averages.
          </p>
        </section>

        {/* ESSENTIAL EXPENSES AND SURPLUS */}
        <section className="creditbridge-section">
          <div className="creditbridge-section-heading">
            <span className="creditbridge-eyebrow">
              FINANCIAL CAPACITY
            </span>
            <h2>Expense & Surplus Overview</h2>
            <p>
              A snapshot of your estimated financial position.
            </p>
          </div>

          <div className="creditbridge-capacity-grid">

            <div className="capacity-card">
              <span className="capacity-icon">🧾</span>
              <div>
                <p>Essential Expenses Due This Month</p>
                <h3>
                  {formatMoney(
                    profile?.current_month_essential_expenses
                  )}
                </h3>
                <span>Based on your saved expense entries</span>
              </div>
            </div>

            <div className="capacity-card">
              <span className="capacity-icon">💹</span>
              <div>
                <p>Estimated Surplus</p>
                <h3 className={
                  Number(profile?.estimated_surplus || 0) >= 0
                    ? "creditbridge-positive"
                    : "creditbridge-negative"
                }>
                  {formatMoney(profile?.estimated_surplus)}
                </h3>
                <span>
                  Average monthly take-home minus current-month essential expenses
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* PROFILE COMPLETENESS */}
        <section className="creditbridge-section">
          <div className="creditbridge-section-heading">
            <span className="creditbridge-eyebrow">
              BUILD YOUR FINANCIAL HISTORY
            </span>
            <h2>Your FINORA Record</h2>
          </div>

          <div className="creditbridge-record-card">
            <div className="record-icon">📁</div>

            <div className="record-content">
              <h3>
                {profile?.months_with_records || 0} month(s) of income records available
              </h3>

              <p>
                Continue recording your delivery earnings and work
                expenses regularly to develop a more useful financial
                history.
              </p>
            </div>

            <Link to="/income-tracker" className="record-action no-print">
              Add Income →
            </Link>
          </div>
        </section>

        {/* IMPORTANT DISCLAIMER */}
        <section className="creditbridge-disclaimer">
          <span>ⓘ</span>

          <div>
            <h3>Important Information</h3>

            <p>
              CreditBridge is a FINORA financial summary generated
              from information entered and saved by you. The figures
              are self-reported and are not independently verified.
              This profile is not an official CIBIL score, credit
              rating, or loan eligibility assessment. It does not
              guarantee loan approval or acceptance by any lender.
            </p>
          </div>
        </section>

        {/* PRINT ACTION */}
        <div className="creditbridge-bottom-actions no-print">
          <button onClick={handlePrint}>
            ⬇ Download Financial Profile
          </button>

          <Link to="/user-dashboard">
            Back to Dashboard
          </Link>
        </div>

      </main>

      <footer className="creditbridge-footer">
        <strong>FINORA<span>.</span></strong>
        <p>Your Income. Your Stability.</p>
        <span>© 2026 FINORA. Financial planning for delivery partners.</span>
      </footer>

    </div>
  );
}

export default CreditBridge;
