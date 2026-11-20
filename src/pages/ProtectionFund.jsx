
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ProtectionFund.css";

const API_URL = "http://localhost:5000/api/features";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2
  })}`;

function ProtectionFund() {
  const navigate = useNavigate();

  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [contribution, setContribution] = useState("");
  const [withdrawal, setWithdrawal] = useState("");

  const [fundBalance, setFundBalance] = useState(0);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const target = Number(expenses || 0) * 3;

  const suggestedSaving = Math.max(
    0,
    Number(income || 0) - Number(expenses || 0)
  );

  const progress =
    hasCalculated && target > 0
      ? Math.min((fundBalance / target) * 100, 100)
      : 0;

  const fetchFundBalance = async () => {
    const token = localStorage.getItem("finoraToken");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/fund`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("finoraToken");
        localStorage.removeItem("finoraUser");
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to load fund balance.");
      }

      setFundBalance(Number(data.balance || 0));
    } catch (error) {
      console.error("Fund loading error:", error);
      setMessage(error.message || "Unable to load protection fund.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundBalance();
  }, []);

  const calculateFund = () => {
    if (
      income.trim() === "" ||
      expenses.trim() === "" ||
      !Number.isFinite(Number(income)) ||
      !Number.isFinite(Number(expenses)) ||
      Number(income) < 0 ||
      Number(expenses) < 0
    ) {
      setMessage("Please enter valid monthly income and essential expenses.");
      return;
    }

    setHasCalculated(true);
    setMessage("Your protection fund plan has been calculated.");
  };

  const updateFund = async () => {
    const contributionAmount = Number(contribution);
    const withdrawalAmount = Number(withdrawal);

    if (contribution.trim() === "" && withdrawal.trim() === "") {
      setMessage("Enter a contribution or withdrawal amount.");
      return;
    }

    if (contribution.trim() !== "" && withdrawal.trim() !== "") {
      setMessage("Please submit a contribution or withdrawal separately.");
      return;
    }

    const amount = contribution.trim() !== ""
      ? contributionAmount
      : withdrawalAmount;

    const transactionType = contribution.trim() !== ""
      ? "contribution"
      : "withdrawal";

    if (!Number.isFinite(amount) || amount <= 0) {
      setMessage("Enter a valid amount greater than zero.");
      return;
    }

    if (transactionType === "withdrawal" && amount > fundBalance) {
      setMessage("Withdrawal cannot exceed your available fund balance.");
      return;
    }

    const token = localStorage.getItem("finoraToken");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/fund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          transaction_type: transactionType,
          amount,
          notes: transactionType === "contribution"
            ? "Protection fund contribution"
            : "Protection fund withdrawal"
        })
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("finoraToken");
        localStorage.removeItem("finoraUser");
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Fund update failed.");
      }

      await fetchFundBalance();

      setContribution("");
      setWithdrawal("");

      setMessage(
        transactionType === "contribution"
          ? "Contribution saved successfully."
          : "Withdrawal saved successfully."
      );

    } catch (error) {
      console.error("Fund update error:", error);
      setMessage(error.message || "Unable to update protection fund.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="protection-page">

      <nav className="protection-navbar">
        <Link to="/user-dashboard" className="protection-logo">
          FINORA<span>.</span>
        </Link>
        <Link to="/user-dashboard">Back to Dashboard</Link>
      </nav>

      <section className="protection-header">
        <p className="protection-label">FINANCIAL SAFETY NET</p>
        <h1>Smart Lean-Month Protection Fund</h1>
        <p>
          Build a financial cushion during good earning periods
          and use it to manage essential expenses during low-income months.
        </p>
      </section>

      <section className="protection-container">

        <div className="protection-card">
          <h2>Calculate Your Protection Fund</h2>

          <p className="protection-description">
            Enter your estimated monthly income and essential expenses
            to calculate a personalised savings target.
          </p>

          <div className="protection-form">

            <label>Estimated Monthly Income (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter monthly income"
              value={income}
              onChange={(e) => {
                setIncome(e.target.value);
                setHasCalculated(false);
              }}
            />

            <label>Monthly Essential Expenses (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter essential expenses"
              value={expenses}
              onChange={(e) => {
                setExpenses(e.target.value);
                setHasCalculated(false);
              }}
            />

            <label>Actual Protection Fund Balance (₹)</label>
            <input
              type="text"
              value={loading ? "Loading..." : money(fundBalance)}
              readOnly
            />

            <button onClick={calculateFund} disabled={loading}>
              Calculate My Fund
            </button>

          </div>
        </div>

        <div className="protection-results">

          <div className="protection-result-card">
            <p>Recommended Fund Target</p>
            <h2>{hasCalculated ? money(target) : "—"}</h2>
            <span>Three months of entered essential expenses</span>
          </div>

          <div className="protection-result-card">
            <p>Suggested Monthly Saving</p>
            <h2>{hasCalculated ? money(suggestedSaving) : "—"}</h2>
            <span>Estimated surplus after essential expenses</span>
          </div>

          <div className="protection-result-card">
            <p>Available Fund Balance</p>
            <h2>{loading ? "..." : money(fundBalance)}</h2>
            <span>Actual saved protection reserve</span>
          </div>

        </div>

        <div className="protection-card progress-card">
          <h2>Protection Fund Progress</h2>

          <div className="progress-info">
            <span>Current Savings</span>
            <strong>
              {hasCalculated ? `${progress.toFixed(1)}%` : "Calculate target first"}
            </strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p>
            {money(fundBalance)} saved out of{" "}
            {hasCalculated ? money(target) : "—"}
          </p>
        </div>

        <div className="protection-card">
          <h2>Manage Your Protection Fund</h2>

          <p className="protection-description">
            Record a contribution during higher-income periods
            or a withdrawal when you need your reserve.
          </p>

          <div className="protection-form">

            <label>Contribution Amount (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter amount to save"
              value={contribution}
              onChange={(e) => {
                setContribution(e.target.value);
                if (e.target.value) setWithdrawal("");
              }}
            />

            <label>Withdrawal Amount (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter amount to withdraw"
              value={withdrawal}
              onChange={(e) => {
                setWithdrawal(e.target.value);
                if (e.target.value) setContribution("");
              }}
            />

            <button onClick={updateFund} disabled={saving || loading}>
              {saving ? "Updating..." : "Update Protection Fund"}
            </button>

          </div>

          {message && (
            <p className="protection-message" role="status">
              {message}
            </p>
          )}
        </div>

        <div className="protection-tip">
          <h3>FINORA Smart Tip</h3>
          <p>
            Save more when earnings are higher. During low-income
            months, use your reserve carefully to help cover essential expenses.
          </p>
        </div>

        <p className="protection-disclaimer">
          This is a financial planning and virtual savings tracker.
          It does not hold, transfer or insure actual money.
        </p>

      </section>
    </div>
  );
}

export default ProtectionFund;
