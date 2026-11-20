
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const weeklyEarnings = [
    { day: "Mon", amount: 650 },
    { day: "Tue", amount: 850 },
    { day: "Wed", amount: 720 },
    { day: "Thu", amount: 950 },
    { day: "Fri", amount: 780 },
    { day: "Sat", amount: 1100 },
    { day: "Sun", amount: 900 },
  ];

  const maxEarning = 1100;

  return (
    <div className="finora">

      {/* NAVBAR */}
      <nav className="finora-navbar">
        <a href="#home" className="finora-logo">
          FINORA<span>.</span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#features">Features</a>
        </div>

        <div className="nav-actions">
          <a href="/login" className="login-link">Sign In</a>
          <a href="/signup" className="signup-link">Sign Up</a>
        </div>
      </nav>

      <main className="finora-main" id="home">

        {/* WELCOME */}
        <section className="welcome-section">
          <div>
            <span className="eyebrow">YOUR FINANCIAL SPACE</span>
            <h1>
              Your income,<br />
              <span>your stability.</span>
            </h1>
            <p>
              Take control of your earnings, manage everyday work
              expenses and build a stronger financial future with FINORA.
            </p>
          </div>

          <div className="overview-label">
            <span>FINANCIAL OVERVIEW</span>
            <strong>Weekly Dashboard</strong>
          </div>
        </section>

        {/* STAT CARDS */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-heading">
              <span>Total Earnings</span>
              <span className="stat-icon">↗</span>
            </div>
            <h2>₹5,950</h2>
            <p>This week</p>
          </div>

          <div className="stat-card">
            <div className="stat-heading">
              <span>Work Expenses</span>
              <span className="stat-icon">−</span>
            </div>
            <h2>₹1,250</h2>
            <p>This week</p>
          </div>

          <div className="stat-card">
            <div className="stat-heading">
              <span>Net Income</span>
              <span className="stat-icon">₹</span>
            </div>
            <h2>₹4,700</h2>
            <p>After work expenses</p>
          </div>

          <div className="stat-card reserve-stat">
            <div className="stat-heading">
              <span>Emergency Reserve</span>
              <span className="stat-icon">◇</span>
            </div>
            <h2>₹8,000</h2>
            <p>Your safety savings</p>
          </div>

        </section>

        {/* EARNINGS CHART + SAFETY */}
        <section className="dashboard-grid">

          <div className="panel earnings-panel">
            <div className="panel-header">
              <div>
                <h3>Weekly Earnings</h3>
                <p>Track your income throughout the week</p>
              </div>
              <span className="period-tag">This week</span>
            </div>

            <div className="earnings-chart">
              {weeklyEarnings.map((item) => (
                <div className="chart-column" key={item.day}>
                  <span className="chart-value">₹{item.amount}</span>

                  <div className="bar-area">
                    <div
                      className="chart-bar"
                      style={{
                        height: `${(item.amount / maxEarning) * 100}%`,
                      }}
                    />
                  </div>

                  <span className="chart-day">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel safety-panel">
            <span className="eyebrow">YOUR SAFETY NET</span>
            <h3>Emergency Reserve</h3>
            <p className="panel-description">
              Your current savings could cover approximately
            </p>

            <div className="safety-value">
              <strong>8</strong>
              <span>days</span>
            </div>

            <div className="progress-track">
              <div className="progress-fill" />
            </div>

            <p className="safety-message">
              Keep growing your reserve to prepare for unexpected
              low-income days.
            </p>
          </div>

        </section>

        {/* QUICK ACTIONS + ACTIVITY */}
        <section className="dashboard-grid bottom-grid">

          <div className="panel">
            <h3>Quick Actions</h3>
            <p className="panel-description">
              Manage your daily finances
            </p>

            <div className="quick-actions">

              <button
                onClick={() => navigate("/income-tracker?tab=earnings")}
              >
                + Add Earnings
              </button>

              <button
                onClick={() => navigate("/income-tracker?tab=expenses")}
              >
                + Add Expense
              </button>

              <button
                onClick={() => navigate("/protection-fund")}
              >
                View Savings
              </button>

              <button
                onClick={() => navigate("/income-simulator")}
              >
                Income Simulator
              </button>

            </div>
          </div>

          <div className="panel activity-panel">
            <h3>Recent Activity</h3>

            <div className="activity-row">
              <div className="activity-info">
                <strong>Delivery Earnings</strong>
                <span>Today · 25 deliveries</span>
              </div>
              <strong className="income">+₹850</strong>
            </div>

            <div className="activity-row">
              <div className="activity-info">
                <strong>Fuel Expense</strong>
                <span>Today · Work expense</span>
              </div>
              <strong className="expense">−₹180</strong>
            </div>

            <div className="activity-row">
              <div className="activity-info">
                <strong>Reserve Savings</strong>
                <span>Yesterday · Savings</span>
              </div>
              <strong className="income">+₹300</strong>
            </div>
          </div>

        </section>

        {/* SMART INSIGHT */}
        <section className="insight-section" id="features">
          <div className="insight-symbol">✦</div>
          <div>
            <span className="eyebrow">FINORA INSIGHT</span>
            <h3>Make your high-income days count.</h3>
            <p>
              Set aside a portion of your earnings on better days.
              A small reserve today can help you manage unexpected
              low-income days tomorrow.
            </p>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about-section" id="about">
          <span className="eyebrow">ABOUT FINORA</span>
          <h2>Built for the reality of irregular income.</h2>
          <p>
            FINORA helps delivery partners manage changing daily earnings,
            understand work expenses, plan essential spending and prepare
            for uncertain income. Because financial stability should not
            depend on earning the same amount every day.
          </p>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="finora-footer">
        <a href="#home" className="finora-logo">
          FINORA<span>.</span>
        </a>
        <p>Your Income. Your Stability.</p>
        <span>© 2026 FINORA. All rights reserved.</span>
      </footer>

    </div>
  );
}

export default Dashboard;
