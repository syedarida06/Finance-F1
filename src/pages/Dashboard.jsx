
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const features = [
    {
      title: "True Take-Home Income Tracker",
      description: "Track delivery earnings, incentives and work expenses to calculate your actual income."
    },
    {
      title: "Income Instability Alert",
      description: "Identify sudden drops in earnings and understand changes in your income."
    },
    {
      title: "Essential Expense Shortfall Alert",
      description: "Check whether your available money can cover upcoming essential expenses."
    },
    {
      title: "Workday Loss & Emergency Protection",
      description: "Estimate lost income when unexpected events interrupt your work."
    },
    {
      title: "Smart Lean-Month Protection Fund",
      description: "Plan flexible savings during better earning periods to prepare for low-income days."
    }
  ];

  return (
    <div className="finora">

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
          <button className="login-link" onClick={() => navigate("/login")}>
            Sign In
          </button>
          <button className="signup-link" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </nav>

      <main className="finora-main" id="home">

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

            <button
              className="signup-link"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          </div>

          <div className="overview-label">
            <span>FINANCIAL STABILITY PLATFORM</span>
            <strong>Built for Delivery Partners</strong>
          </div>
        </section>

        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-heading">
              <span>Income Tracking</span>
              <span className="stat-icon">↗</span>
            </div>
            <h2>Track</h2>
            <p>Understand your actual take-home income</p>
          </div>

          <div className="stat-card">
            <div className="stat-heading">
              <span>Early Alerts</span>
              <span className="stat-icon">!</span>
            </div>
            <h2>Prepare</h2>
            <p>Identify possible financial difficulties</p>
          </div>

          <div className="stat-card">
            <div className="stat-heading">
              <span>Expense Planning</span>
              <span className="stat-icon">₹</span>
            </div>
            <h2>Manage</h2>
            <p>Plan essential expenses with confidence</p>
          </div>

          <div className="stat-card reserve-stat">
            <div className="stat-heading">
              <span>Emergency Savings</span>
              <span className="stat-icon">◇</span>
            </div>
            <h2>Protect</h2>
            <p>Prepare for unexpected low-income periods</p>
          </div>

        </section>

        <section className="dashboard-grid" id="features">

          <div className="panel earnings-panel">
            <div className="panel-header">
              <div>
                <h3>How FINORA Works</h3>
                <p>A practical approach to managing irregular income</p>
              </div>
            </div>

            <div className="quick-actions">
              <div>Track your earnings and work expenses</div>
              <div>Identify income fluctuations</div>
              <div>Plan upcoming essential expenses</div>
              <div>Build a flexible protection fund</div>
            </div>
          </div>

          <div className="panel safety-panel">
            <span className="eyebrow">YOUR SAFETY NET</span>
            <h3>Prepare for Lean Months</h3>
            <p className="panel-description">
              Build financial resilience by planning savings
              during higher-income periods.
            </p>

            <div className="safety-value">
              <strong>Plan</strong>
            </div>

            <p className="safety-message">
              Your savings plan can help you manage essential
              expenses when earnings decrease.
            </p>
          </div>

        </section>

        <section className="dashboard-grid bottom-grid">

          <div className="panel">
            <h3>Explore FINORA</h3>
            <p className="panel-description">
              Get started with your financial planning.
            </p>

            <div className="quick-actions">
              <button onClick={() => navigate("/signup")}>
                Create Account
              </button>

              <button onClick={() => navigate("/login")}>
                Sign In
              </button>
            </div>
          </div>

          <div className="panel activity-panel">
            <h3>Designed for Your Financial Reality</h3>
            <p className="panel-description">
              Unlike traditional budgeting tools that assume a fixed
              salary, FINORA focuses on changing daily earnings and
              the financial challenges faced by delivery partners.
            </p>
          </div>

        </section>

        <section className="insight-section">
          <div className="insight-symbol">✦</div>
          <div>
            <span className="eyebrow">FINORA INSIGHT</span>
            <h3>Make your high-income days count.</h3>
            <p>
              Set aside a portion of your earnings on better days.
              A flexible reserve can help you manage unexpected
              low-income days.
            </p>
          </div>
        </section>

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
