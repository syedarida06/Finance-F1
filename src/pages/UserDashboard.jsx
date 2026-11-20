
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./UserDashboard.css";

const API_URL = "http://localhost:5000/api";

const features = [
  {
    number: "01",
    icon: "💰",
    title: "True Take-Home Income Tracker",
    description: "Track daily earnings, incentives and work expenses to understand your actual take-home income.",
    path: "/income-tracker",
    action: "Track income"
  },
  {
    number: "02",
    icon: "📊",
    title: "Income Instability Alert",
    description: "Identify sudden drops and changes in your earnings before they affect your finances.",
    path: "/income-instability",
    action: "Analyse income"
  },
  {
    number: "03",
    icon: "🧾",
    title: "Essential Expense Shortfall Alert",
    description: "Check whether your available money can cover upcoming essential expenses.",
    path: "/expense-shortfall",
    action: "Check expenses"
  },
  {
    number: "04",
    icon: "🛡️",
    title: "Workday Loss & Emergency Protection",
    description: "Estimate lost earnings during unexpected work interruptions and plan ahead.",
    path: "/emergency-protection",
    action: "Plan emergency"
  },
  {
    number: "05",
    icon: "🐷",
    title: "Smart Lean-Month Protection Fund",
    description: "Build a flexible reserve during good earning periods to manage lean months.",
    path: "/protection-fund",
    action: "Manage fund"
  }
];

const formatMoney = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2
  })}`;

const getRecords = (data) => {
  if (Array.isArray(data)) return data;
  return data?.records || data?.income || [];
};

function UserDashboard() {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [incomeRecords, setIncomeRecords] = useState([]);
  const [protectionBalance, setProtectionBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("finoraToken");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      try {
        const [profileResponse, incomeResponse, fundResponse] =
          await Promise.all([
            fetch(`${API_URL}/users/profile`, { headers }),
            fetch(`${API_URL}/features/income`, { headers }),
            fetch(`${API_URL}/features/fund`, { headers })
          ]);

        if (
          profileResponse.status === 401 ||
          incomeResponse.status === 401 ||
          fundResponse.status === 401
        ) {
          localStorage.removeItem("finoraToken");
          localStorage.removeItem("finoraUser");
          navigate("/login", { replace: true });
          return;
        }

        if (!profileResponse.ok || !incomeResponse.ok || !fundResponse.ok) {
          throw new Error("Unable to load all dashboard information.");
        }

        const profileData = await profileResponse.json();
        const incomeData = await incomeResponse.json();
        const fundData = await fundResponse.json();

        setUser(profileData.user || null);
        localStorage.setItem(
          "finoraUser",
          JSON.stringify(profileData.user || {})
        );

        setIncomeRecords(getRecords(incomeData));

        setProtectionBalance(
          Number(fundData.balance || 0)
        );

      } catch (error) {
        console.error("Dashboard loading error:", error);
        setDataError("Unable to load your latest financial data. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("finoraToken");
    localStorage.removeItem("finoraUser");
    navigate("/login", { replace: true });
  };

  // Calculate actual values from saved income records.
  const totalEarnings = incomeRecords.reduce(
    (total, record) =>
      total +
      Number(record.delivery_earnings || 0) +
      Number(record.incentives || 0),
    0
  );

  const totalExpenses = incomeRecords.reduce(
    (total, record) =>
      total +
      Number(record.fuel || 0) +
      Number(record.maintenance || 0) +
      Number(record.parking || 0) +
      Number(record.mobile_data || 0) +
      Number(record.other_expenses || 0),
    0
  );

  const netIncome = totalEarnings - totalExpenses;

  // Build recent activity from actual saved income records.
  const recentActivities = [...incomeRecords]
    .sort((a, b) => {
      const dateA = new Date(a.record_date || a.created_at || 0);
      const dateB = new Date(b.record_date || b.created_at || 0);
      return dateB - dateA;
    })
    .slice(0, 5);

  const getDate = (record) => {
    const dateValue = record.record_date || record.created_at;

    if (!dateValue) return "Date unavailable";

    return new Date(dateValue).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="user-dashboard">

      {/* NAVIGATION */}
      <nav className="user-navbar">
        <Link to="/user-dashboard" className="user-logo">
          FINORA<span>.</span>
        </Link>

        <div className="user-nav-right">

          <Link to="/" className="dashboard-nav-link">
            Home
          </Link>

          <Link to="/user-dashboard" className="dashboard-nav-link">
            Dashboard
          </Link>

          {/* NOTIFICATIONS */}
          <div className="nav-menu-wrapper">
            <button
              className="nav-icon-button"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileOpen(false);
              }}
            >
              <span>🔔</span>
            </button>

            {notificationsOpen && (
              <div className="nav-dropdown notification-dropdown">
                <h3>Financial Reminders</h3>

                <div className="dropdown-notification">
                  <span>📉</span>
                  <div>
                    <strong>Monitor your income</strong>
                    <p>Record earnings regularly to identify changes.</p>
                  </div>
                </div>

                <div className="dropdown-notification">
                  <span>🛡️</span>
                  <div>
                    <strong>Build your reserve</strong>
                    <p>Contribute when your earnings allow.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PROFILE MENU */}
          <div className="nav-menu-wrapper">
            <button
              className="profile-trigger"
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
              }}
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
            >
              <span className="user-avatar">
                {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
              </span>

              <span className="profile-trigger-text">My Account</span>
              <span className="dropdown-arrow">⌄</span>
            </button>

            {profileOpen && (
              <div className="nav-dropdown profile-dropdown">
                <div className="profile-dropdown-header">
                  <span className="user-avatar large-avatar">
                    {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </span>

                  <div>
                    <strong>{user?.full_name || "Delivery Partner"}</strong>
                    <p>{user?.email || "FINORA Member"}</p>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <Link to="/my-account" className="dropdown-link">
                  <span>👤</span> My Profile
                </Link>

                <Link to="/my-account" className="dropdown-link">
                  <span>⚙️</span> Account Settings
                </Link>

                <button
                  type="button"
                  className="dropdown-link logout-link"
                  onClick={handleLogout}
                >
                  <span>↪</span> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="user-main">

        {/* WELCOME HERO */}
        <section className="user-welcome">
          <div className="welcome-content">
            <div className="welcome-label">
              <span className="welcome-label-dot"></span>
              YOUR FINANCIAL CONTROL CENTRE
            </div>

            <h1>
              Welcome back,{" "}
              <span>
                {loading ? "..." : user?.full_name || "Delivery Partner"}!
              </span>
            </h1>

            <p>
              Your earnings may change every day. Stay prepared,
              make informed decisions and build stronger financial
              stability with FINORA.
            </p>

            <div className="welcome-actions">
              <Link to="/income-tracker" className="welcome-primary-button">
                + Record Income
              </Link>

              <Link to="/protection-fund" className="welcome-secondary-button">
                View Protection Fund →
              </Link>
            </div>
          </div>

          <div className="welcome-visual">
            <div className="welcome-visual-circle">
              <span>₹</span>
            </div>

            <div className="welcome-visual-caption">
              <strong>Your Income.</strong>
              <span>Your Stability.</span>
            </div>
          </div>
        </section>

        {/* FINANCIAL OVERVIEW */}
        <section className="overview-section">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">YOUR MONEY AT A GLANCE</span>
              <h2>Financial Overview</h2>
              <p>Your actual recorded financial activity.</p>
            </div>

            <span className="sample-period">
              All recorded data
            </span>
          </div>

          {dataError && (
            <p role="alert" className="dashboard-error">
              {dataError}
            </p>
          )}

          <div className="user-summary">

            <div className="summary-card earnings-card">
              <div className="summary-top">
                <span className="summary-icon">↗</span>
                <span className="summary-tag">EARNINGS</span>
              </div>
              <p>Total Earnings</p>
              <h2>{loading ? "..." : formatMoney(totalEarnings)}</h2>
              <span className="summary-description">Saved delivery earnings and incentives</span>
            </div>

            <div className="summary-card expenses-card">
              <div className="summary-top">
                <span className="summary-icon">↘</span>
                <span className="summary-tag">EXPENSES</span>
              </div>
              <p>Work Expenses</p>
              <h2>{loading ? "..." : formatMoney(totalExpenses)}</h2>
              <span className="summary-description">Saved work-related expenses</span>
            </div>

            <div className="summary-card net-card">
              <div className="summary-top">
                <span className="summary-icon">₹</span>
                <span className="summary-tag">TAKE-HOME</span>
              </div>
              <p>Net Income</p>
              <h2>{loading ? "..." : formatMoney(netIncome)}</h2>
              <span className="summary-description">Earnings after work expenses</span>
            </div>

            <div className="summary-card fund-card">
              <div className="summary-top">
                <span className="summary-icon">♧</span>
                <span className="summary-tag">SAVINGS</span>
              </div>
              <p>Protection Fund</p>
              <h2>{loading ? "..." : formatMoney(protectionBalance)}</h2>
              <span className="summary-description">Actual available fund balance</span>
            </div>

          </div>
        </section>

        {/* MAIN DASHBOARD GRID */}
        <section className="dashboard-main-grid">

          <div className="dashboard-panel protection-widget">
            <div className="panel-heading">
              <div>
                <span className="section-eyebrow">YOUR FINANCIAL SAFETY NET</span>
                <h2>Protection Fund</h2>
              </div>
              <span className="panel-icon">🛡️</span>
            </div>

            <div className="fund-amount">
              <h3>{loading ? "..." : formatMoney(protectionBalance)}</h3>
              <span>Current available balance</span>
            </div>

            <p className="fund-widget-note">
              Your protection fund balance is calculated from your
              recorded contributions and withdrawals.
            </p>

            <Link to="/protection-fund" className="panel-action">
              Manage Protection Fund →
            </Link>
          </div>

          <div className="dashboard-panel alerts-widget">
            <div className="panel-heading">
              <div>
                <span className="section-eyebrow">STAY FINANCIALLY PREPARED</span>
                <h2>Financial Watch</h2>
              </div>
              <span className="panel-icon">🔔</span>
            </div>

            <div className="alert-item alert-info">
              <span className="alert-symbol">📊</span>
              <div>
                <strong>Monitor your income</strong>
                <p>Record earnings regularly to identify unusual changes.</p>
              </div>
            </div>

            <div className="alert-item alert-warning">
              <span className="alert-symbol">🧾</span>
              <div>
                <strong>Plan upcoming expenses</strong>
                <p>Check whether your available funds can cover essential bills.</p>
              </div>
            </div>

            <div className="alert-item alert-success">
              <span className="alert-symbol">🛡️</span>
              <div>
                <strong>Strengthen your safety net</strong>
                <p>Build your protection fund during higher-income periods.</p>
              </div>
            </div>

            <p className="alert-disclaimer">
              Financial planning reminders.
            </p>
          </div>

        </section>

        {/* FIVE FINORA FEATURES */}
        <section className="user-features">
          <div className="feature-heading">
            <div>
              <span className="section-eyebrow">BUILT FOR IRREGULAR INCOME</span>
              <h2>Your Financial Tools</h2>
              <p>Five practical tools to help you manage uncertain earnings.</p>
            </div>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <Link
                to={feature.path}
                className="user-feature-card"
                key={feature.number}
              >
                <div className="feature-card-top">
                  <div className="feature-icon">{feature.icon}</div>
                  <span className="feature-number">{feature.number}</span>
                </div>

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>

                <div className="feature-card-bottom">
                  <span>{feature.action}</span>
                  <span className="feature-arrow">↗</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section className="dashboard-panel activity-widget">
          <div className="panel-heading">
            <div>
              <span className="section-eyebrow">YOUR FINANCIAL RECORD</span>
              <h2>Recent Activity</h2>
              <p>Your latest saved income records.</p>
            </div>
            <span className="panel-icon">📋</span>
          </div>

          <div className="activity-list">
            {loading ? (
              <p>Loading your records...</p>
            ) : recentActivities.length === 0 ? (
              <p>No income records yet. Start by recording your earnings.</p>
            ) : (
              recentActivities.map((record) => {
                const earnings =
                  Number(record.delivery_earnings || 0) +
                  Number(record.incentives || 0);

                const expenses =
                  Number(record.fuel || 0) +
                  Number(record.maintenance || 0) +
                  Number(record.parking || 0) +
                  Number(record.mobile_data || 0) +
                  Number(record.other_expenses || 0);

                const net = earnings - expenses;

                return (
                  <div className="activity-row" key={record.id}>
                    <div className="activity-icon">💰</div>

                    <div className="activity-details">
                      <strong>Income record</strong>
                      <span>{getDate(record)}</span>
                    </div>

                    <div className="activity-amount-section">
                      <strong className={net >= 0 ? "positive" : "negative"}>
                        {formatMoney(net)}
                      </strong>
                      <span>Net income</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* FINORA INSIGHT */}
        <section className="finora-insight">
          <div className="insight-icon">✦</div>
          <div>
            <span className="section-eyebrow">A FINORA REMINDER</span>
            <h3>Financial stability is built one decision at a time.</h3>
            <p>
              Track what you earn, prepare for unexpected situations
              and build a reserve that supports you during lean months.
            </p>
          </div>
        </section>

      </main>

      <footer className="user-footer">
        <Link to="/user-dashboard" className="footer-logo">
          FINORA<span>.</span>
        </Link>
        <p>Your Income. Your Stability.</p>
        <span>
          © 2026 FINORA. Financial planning for delivery partners.
        </span>
      </footer>

    </div>
  );
}

export default UserDashboard;
