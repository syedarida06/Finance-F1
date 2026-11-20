
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css";

function SignIn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setError(
      "Login is ready for backend integration. Your account will be verified once the backend is connected."
    );
  };

  return (
    <div className="signin-page">

      {/* NAVBAR */}
      <nav className="signin-navbar">

        <Link to="/" className="signin-logo">
          FINORA<span>.</span>
        </Link>

        <div className="signin-nav-links">
          <Link to="/">Home</Link>
          <Link to="/#about">About</Link>
          <Link to="/#features">Features</Link>
        </div>

        <div className="signin-nav-right">
          <span>New to FINORA?</span>

          <Link to="/signup" className="signin-signup-link">
            Sign Up
          </Link>
        </div>

      </nav>

      {/* MAIN CONTENT */}
      <main className="signin-main">

        {/* LEFT INTRODUCTION */}
        <section className="signin-intro">

          <span className="signin-eyebrow">
            WELCOME BACK
          </span>

          <h1>
            Take control of
            <br />
            <span>your finances.</span>
          </h1>

          <p>
            Your earnings, expenses and financial goals,
            all in one place. Sign in to continue building
            a more stable financial future.
          </p>

          <div className="signin-benefits">

            <div>
              <span>✓</span>
              Monitor your daily earnings
            </div>

            <div>
              <span>✓</span>
              Keep track of work expenses
            </div>

            <div>
              <span>✓</span>
              Plan and protect your savings
            </div>

          </div>

          <div className="signin-trust-note">

            <span className="signin-trust-icon">✦</span>

            <div>
              <strong>Every earning counts.</strong>
              <p>Make every day a step towards financial stability.</p>
            </div>

          </div>

        </section>

        {/* SIGN IN FORM */}
        <section className="signin-card">

          <div className="signin-card-heading">

            <span className="signin-card-label">
              YOUR FINORA ACCOUNT
            </span>

            <h2>Sign in to FINORA</h2>

            <p>Enter your account details to continue.</p>

          </div>

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="signin-field">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />

            </div>

            {/* PASSWORD */}
            <div className="signin-field">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

            </div>

            {/* FORGOT PASSWORD */}
            <div className="signin-forgot">
              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <p className="signin-message" role="alert">
                {error}
              </p>
            )}

            {/* SUBMIT BUTTON */}
            <button type="submit" className="signin-submit">
              Sign In <span>→</span>
            </button>

          </form>

          <div className="signin-divider">
            <span>OR</span>
          </div>

          <p className="signin-switch">
            Don't have an account?
            <Link to="/signup"> Create Account</Link>
          </p>

          <div className="signin-security">
            <span>🔒</span>
            Your financial information deserves protection.
          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="signin-footer">

        <Link to="/" className="signin-logo">
          FINORA<span>.</span>
        </Link>

        <p>Your Income. Your Stability.</p>

        <span>© 2026 FINORA. All rights reserved.</span>

      </footer>

    </div>
  );
}

export default SignIn;
