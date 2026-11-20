
import React, { useState } from "react";
import "./ProtectionFund.css";

function ProtectionFund() {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [balance, setBalance] = useState("");
  const [contribution, setContribution] = useState("");
  const [withdrawal, setWithdrawal] = useState("");
  const [message, setMessage] = useState("");

  const [fundBalance, setFundBalance] = useState(0);
  const [hasCalculated, setHasCalculated] = useState(false);

  const target = Number(expenses) * 3;
  const suggestedSaving = Math.max(
    0,
    Number(income) - Number(expenses)
  );

  const progress =
    target > 0
      ? Math.min((fundBalance / target) * 100, 100)
      : 0;

  const calculateFund = () => {
    if (
      income === "" ||
      expenses === "" ||
      balance === "" ||
      Number(income) < 0 ||
      Number(expenses) < 0 ||
      Number(balance) < 0
    ) {
      setMessage("Please enter valid income, expenses and fund balance.");
      return;
    }

    setFundBalance(Number(balance));
    setHasCalculated(true);
    setMessage("Your protection fund plan has been calculated.");
  };

  const updateFund = () => {
    if (!hasCalculated) {
      setMessage("Calculate your fund plan first.");
      return;
    }

    if (
      contribution === "" ||
      withdrawal === "" ||
      Number(contribution) < 0 ||
      Number(withdrawal) < 0
    ) {
      setMessage("Enter valid contribution and withdrawal amounts.");
      return;
    }

    if (Number(withdrawal) > fundBalance + Number(contribution)) {
      setMessage("Withdrawal cannot exceed your available fund balance.");
      return;
    }

    const updated =
      fundBalance +
      Number(contribution) -
      Number(withdrawal);

    setFundBalance(updated);
    setContribution("");
    setWithdrawal("");
    setMessage("Your protection fund balance has been updated.");
  };

  return (
    <div className="protection-page">
      <nav className="protection-navbar">
        <h2>FINORA<span>.</span></h2>
        <a href="/user-dashboard">Back to Dashboard</a>
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
            Enter your monthly financial details to estimate
            your personalised emergency savings target.
          </p>

          <div className="protection-form">
            <label>Monthly Income (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="Enter monthly income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />

            <label>Monthly Essential Expenses (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="Enter essential expenses"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
            />

            <label>Current Protection Fund Balance (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="Enter current savings"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
            />

            <button onClick={calculateFund}>
              Calculate My Fund
            </button>
          </div>
        </div>

        <div className="protection-results">
          <div className="protection-result-card">
            <p>Recommended Fund Target</p>
            <h2>₹{hasCalculated ? target.toLocaleString("en-IN") : "0"}</h2>
            <span>Based on 3 months of essential expenses</span>
          </div>

          <div className="protection-result-card">
            <p>Suggested Monthly Saving</p>
            <h2>
              ₹{hasCalculated
                ? suggestedSaving.toLocaleString("en-IN")
                : "0"}
            </h2>
            <span>Estimated surplus after essential expenses</span>
          </div>

          <div className="protection-result-card">
            <p>Available Fund Balance</p>
            <h2>₹{fundBalance.toLocaleString("en-IN")}</h2>
            <span>Your planned protection reserve</span>
          </div>
        </div>

        <div className="protection-card progress-card">
          <h2>Protection Fund Progress</h2>

          <div className="progress-info">
            <span>Current Savings</span>
            <strong>{progress.toFixed(1)}%</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p>
            ₹{fundBalance.toLocaleString("en-IN")} saved out of
            ₹{(hasCalculated ? target : 0).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="protection-card">
          <h2>Manage Your Protection Fund</h2>
          <p className="protection-description">
            Add savings during higher-income periods or record
            a planned withdrawal during a lean month.
          </p>

          <div className="protection-form">
            <label>Contribution Amount (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="Enter amount to save"
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
            />

            <label>Withdrawal Amount (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="Enter amount to withdraw"
              value={withdrawal}
              onChange={(e) => setWithdrawal(e.target.value)}
            />

            <button onClick={updateFund}>
              Update Protection Fund
            </button>
          </div>

          {message && (
            <p className="protection-message">{message}</p>
          )}
        </div>

        <div className="protection-tip">
          <h3>FINORA Smart Tip</h3>
          <p>
            Save a little more when earnings are higher.
            During low-income months, use your reserve carefully
            to help cover essential expenses.
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
