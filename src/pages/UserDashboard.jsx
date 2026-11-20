
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./UserDashboard.css";

const features = [
  {
    number: "01",
    icon: "💰",
    title: "True Take-Home Income Tracker",
    description:
      "Track daily earnings, incentives and work expenses to understand your actual take-home income.",
    path: "/income-tracker",
    action: "Track income"
  },
  {
    number: "02",
    icon: "📊",
    title: "Income Instability Alert",
    description:
      "Identify sudden drops and changes in your earnings before they affect your finances.",
    path: "/income-instability",
    action: "Analyse income"
  },
  {
    number: "03",
    icon: "🧾",
    title: "Essential Expense Shortfall Alert",
    description:
      "Check whether your available money can cover upcoming essential expenses.",
    path: "/expense-shortfall",
    action: "Check expenses"
  },
  {
    number: "04",
    icon: "🛡️",
    title: "Workday Loss & Emergency Protection",
    description:
      "Estimate lost earnings during unexpected work interruptions and plan ahead.",
    path: "/emergency-protection",
    action: "Plan emergency"
  },
  {
    number: "05",
    icon: "🐷",
    title: "Smart Lean-Month Protection Fund",
    description:
      "Build a flexible reserve during good earning periods to manage lean months.",
    path: "/protection-fund",
    action: "Manage fund"
  }
];

const activities = [
  {
    icon: "💰",
    title: "Daily earnings recorded",
    detail: "Delivery income",
    amount: "+ ₹1,250",
    type: "positive",
    date: "Sample activity"
  },
  {
    icon: "⛽",
    title: "Work expense added",
    detail: "Fuel expense",
    amount: "- ₹300",
    type: "negative",
    date: "Sample activity"
  },
  {
    icon: "🐷",
    title: "Protection fund contribution",
    detail: "Savings contribution",
    amount: "+ ₹500",
    type: "positive",
    date: "Sample activity"
  }
];

function UserDashboard() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const protectionBalance = 5000;
  const protectionTarget = 15000;
  const protectionProgress = Math.min(
    (protectionBalance / protectionTarget) * 100,
    100
  );

  return (
    <div className="user-dashboard">

      {/* NAVIGATION */}
      <nav className="user-navbar">

        <Link to="/user-dashboard" className="user-logo">
          FINORA<span>.</span>
        </Link>

        <div className="user-nav-right">

          <Link to="/user-dashboard" className="dashboard-nav-link">
            Dashboard
          </Link>

          {/* Notifications */}
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
              <i className="notification-dot"></i>
            </button>

            {notificationsOpen && (
              <div className="nav-dropdown notification-dropdown">
                <h3>Notifications</h3>

                <div className="dropdown-notification">
                  <span>📉</span>
                  <div>
                    <strong>Income monitoring</strong>
                    <p>Keep tracking your daily earnings to identify changes.</p>
                  </div>
                </div>

                <div className="dropdown-notification">
                  <span>🛡️</span>
                  <div>
                    <strong>Build your reserve</strong>
                    <p>Regular savings can help during low-income months.</p>
                  </div>
                </div>

                <p className="dropdown-note">
                  Sample notifications for demonstration.
                </p>
              </div>
            )}

          </div>

          {/* Profile Menu */}
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
              <span className="user-avatar">U</span>
              <span className="profile-trigger-text">My Account</span>
              <span className="dropdown-arrow">⌄</span>
            </button>

            {profileOpen && (
              <div className="nav-dropdown profile-dropdown">

                <div className="profile-dropdown-header">
                  <span className="user-avatar large-avatar">U</span>
                  <div>
                    <strong>Delivery Partner</strong>
                    <p>FINORA Member</p>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <Link to="/my-account" className="dropdown-link">
                  <span>👤</span> My Profile
                </Link>

                <Link to="/my-account" className="dropdown-link">
                  <span>⚙️</span> Account Settings
                </Link>

                <Link to="/login" className="dropdown-link logout-link">
                  <span>↪</span> Logout
                </Link>

                <p className="dropdown-note">
                  Profile details will be connected after signup backend setup.
                </p>

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
              Welcome back, <span>Delivery Partner!</span>
            </h1>

            <p>
              Your earnings may change every day.
              Stay prepared, make informed decisions and build
              stronger financial stability with FINORA.
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
              <p>A snapshot of your financial activity.</p>
            </div>

            <span className="sample-period">Sample monthly data</span>
          </div>

          <div className="user-summary">

            <div className="summary-card earnings-card">
              <div className="summary-top">
                <span className="summary-icon">↗</span>
                <span className="summary-tag">EARNINGS</span>
              </div>
              <p>Total Earnings</p>
              <h2>₹18,500</h2>
              <span className="summary-description">
                Your recorded income
              </span>
            </div>

            <div className="summary-card expenses-card">
              <div className="summary-top">
                <span className="summary-icon">↘</span>
                <span className="summary-tag">EXPENSES</span>
              </div>
              <p>Work Expenses</p>
              <h2>₹3,200</h2>
              <span className="summary-description">
                Fuel, maintenance and more
              </span>
            </div>

            <div className="summary-card net-card">
              <div className="summary-top">
                <span className="summary-icon">₹</span>
                <span className="summary-tag">TAKE-HOME</span>
              </div>
              <p>Net Income</p>
              <h2>₹15,300</h2>
              <span className="summary-description">
                After work expenses
              </span>
            </div>

            <div className="summary-card fund-card">
              <div className="summary-top">
                <span className="summary-icon">♧</span>
                <span className="summary-tag">SAVINGS</span>
              </div>
              <p>Protection Fund</p>
              <h2>₹5,000</h2>
              <span className="summary-description">
                Your planned reserve
              </span>
            </div>

          </div>
        </section>

        {/* MAIN DASHBOARD GRID */}
        <section className="dashboard-main-grid">

          {/* PROTECTION FUND */}
          <div className="dashboard-panel protection-widget">

            <div className="panel-heading">
              <div>
                <span className="section-eyebrow">YOUR FINANCIAL SAFETY NET</span>
                <h2>Protection Fund</h2>
              </div>
              <span className="panel-icon">🛡️</span>
            </div>

            <div className="fund-amount">
              <h3>₹5,000</h3>
              <span>Current planned balance</span>
            </div>

            <div className="fund-progress-details">
              <span>Fund progress</span>
              <strong>{protectionProgress.toFixed(0)}%</strong>
            </div>

            <div
              className="fund-progress-track"
              role="progressbar"
              aria-valuenow={protectionProgress}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Protection fund progress"
            >
              <div
                className="fund-progress-fill"
                style={{ width: `${protectionProgress}%` }}
              ></div>
            </div>

            <div className="fund-target-details">
              <span>₹5,000 saved</span>
              <span>Target: ₹15,000</span>
            </div>

            <p className="fund-widget-note">
              Build your reserve gradually to prepare for low-income months.
            </p>

            <Link to="/protection-fund" className="panel-action">
              Manage Protection Fund →
            </Link>

          </div>

          {/* FINANCIAL ALERTS */}
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
              These are planning reminders, not live financial alerts.
            </p>

          </div>

        </section>

        {/* FIVE FINORA FEATURES */}
        <section className="user-features">

          <div className="feature-heading">
            <div>
              <span className="section-eyebrow">BUILT FOR IRREGULAR INCOME</span>
              <h2>Your Financial Tools</h2>
              <p>
                Five practical tools to help you manage uncertain earnings.
              </p>
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
                  <span className="feature-number">
                    {feature.number}
                  </span>
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
              <p>Keep track of your latest financial updates.</p>
            </div>
            <span className="panel-icon">📋</span>
          </div>

          <div className="activity-list">

            {activities.map((activity, index) => (
              <div className="activity-row" key={index}>

                <div className="activity-icon">
                  {activity.icon}
                </div>

                <div className="activity-details">
                  <strong>{activity.title}</strong>
                  <span>{activity.detail}</span>
                </div>

                <div className="activity-amount-section">
                  <strong className={activity.type}>
                    {activity.amount}
                  </strong>
                  <span>{activity.date}</span>
                </div>

              </div>
            ))}

          </div>

          <p className="activity-disclaimer">
            Example activity only. Actual records will appear after data integration.
          </p>

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

      {/* FOOTER */}
      <footer className="user-footer">
        <Link to="/user-dashboard" className="footer-logo">
          FINORA<span>.</span>
        </Link>
        <p>Your Income. Your Stability.</p>
        <span>© 2026 FINORA. Financial planning for delivery partners.</span>
      </footer>

    </div>
  );
}

export default UserDashboard;
