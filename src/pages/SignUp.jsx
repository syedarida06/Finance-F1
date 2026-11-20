
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    platform: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone,
            platform: formData.platform,
            city: formData.city.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccess("Account created successfully! Redirecting to Sign In...");

      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Registration successful! Please sign in.",
          },
        });
      }, 1000);

    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">

      <nav className="signup-navbar">
        <a href="/" className="signup-logo">
          FINORA<span>.</span>
        </a>

        <div className="signup-nav-links">
          <a href="/">Home</a>
          <a href="/#about">About</a>
          <a href="/#features">Features</a>
        </div>

        <div className="signup-nav-right">
          <span>Already a member?</span>
          <a href="/login" className="signup-login-link">
            Sign In
          </a>
        </div>
      </nav>

      <main className="signup-main">

        <section className="signup-intro">
          <span className="signup-eyebrow">
            WELCOME TO FINORA
          </span>

          <h1>
            Build a more secure
            <br />
            <span>financial future.</span>
          </h1>

          <p>
            Create your account to track your delivery earnings,
            manage work expenses and prepare for uncertain income.
          </p>

          <div className="signup-benefits">
            <div>
              <span>✓</span>
              Track daily and weekly earnings
            </div>

            <div>
              <span>✓</span>
              Manage delivery-related expenses
            </div>

            <div>
              <span>✓</span>
              Build your emergency savings
            </div>
          </div>

          <div className="signup-trust-note">
            <span className="trust-icon">✦</span>
            <div>
              <strong>Your income deserves stability.</strong>
              <p>Make smarter financial decisions with FINORA.</p>
            </div>
          </div>
        </section>

        <section className="signup-card">

          <div className="signup-card-heading">
            <span className="signup-card-label">
              GET STARTED
            </span>

            <h2>Create your account</h2>

            <p>
              Enter your details to get started with FINORA.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="signup-field">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            <div className="signup-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="signup-field">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Enter 10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                maxLength={10}
                inputMode="numeric"
                autoComplete="tel"
                required
              />
            </div>

            <div className="signup-field">
              <label htmlFor="platform">Delivery Platform</label>
              <select
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
              >
                <option value="">Select your platform</option>
                <option value="Zomato">Zomato</option>
                <option value="Swiggy">Swiggy</option>
                <option value="Zepto">Zepto</option>
                <option value="Blinkit">Blinkit</option>
                <option value="JioMart">JioMart</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="signup-field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                name="city"
                placeholder="Enter your city"
                value={formData.city}
                onChange={handleChange}
                autoComplete="address-level2"
                required
              />
            </div>

            <div className="signup-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="signup-field">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <p className="signup-message signup-error" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p className="signup-message signup-success" role="status">
                {success}
              </p>
            )}

            <button
              type="submit"
              className="signup-submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <span>→</span>}
            </button>

          </form>

          <p className="signup-switch">
            Already have an account?
            <a href="/login"> Sign In</a>
          </p>

          <div className="signup-security">
            <span>🔒</span>
            Your information is protected.
          </div>

        </section>
      </main>

      <footer className="signup-footer">
        <a href="/" className="signup-logo">
          FINORA<span>.</span>
        </a>

        <p>Your Income. Your Stability.</p>

        <span>© 2026 FINORA. All rights reserved.</span>
      </footer>

    </div>
  );
}

export default SignUp;
