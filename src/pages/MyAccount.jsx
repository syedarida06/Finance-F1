
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MyAccount.css";

function MyAccount() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialTab = location.state?.tab || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);

  const [profile, setProfile] = useState({
    name: "Delivery Partner",
    phone: "",
    email: "",
    city: "",
    platform: "Swiggy",
  });

  const [editing, setEditing] = useState(false);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    incomeAlerts: true,
    expenseAlerts: true,
    fundReminders: true,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [message, setMessage] = useState("");

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const saveProfile = (e) => {
    e.preventDefault();
    setEditing(false);
    setMessage("Profile updated successfully!");
  };

  const updatePassword = (e) => {
    e.preventDefault();

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setMessage("Please fill in all password fields.");
      return;
    }

    if (passwords.new.length < 8) {
      setMessage("New password must contain at least 8 characters.");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setMessage("New passwords do not match.");
      return;
    }

    setMessage(
      "Password UI validated. Connect the backend to securely change your password."
    );
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="account-page">

      <nav className="account-navbar">
        <div className="account-logo" onClick={() => navigate("/user-dashboard")}>
          FINORA<span>.</span>
        </div>

        <button
          className="account-back"
          onClick={() => navigate("/user-dashboard")}
        >
          ← Back to Dashboard
        </button>
      </nav>

      <main className="account-container">

        <div className="account-heading">
          <p className="account-eyebrow">YOUR ACCOUNT</p>
          <h1>Manage Your Account</h1>
          <p>Manage your personal information and account preferences.</p>
        </div>

        <div className="account-layout">

          <aside className="account-sidebar">

            <div className="account-avatar">
              {profile.name.charAt(0).toUpperCase()}
            </div>

            <h3>{profile.name}</h3>
            <p>{profile.email || "Your FINORA account"}</p>

            <button
              className={activeTab === "profile" ? "account-tab active" : "account-tab"}
              onClick={() => {
                setActiveTab("profile");
                setMessage("");
              }}
            >
              <span>👤</span> My Profile
            </button>

            <button
              className={activeTab === "settings" ? "account-tab active" : "account-tab"}
              onClick={() => {
                setActiveTab("settings");
                setMessage("");
              }}
            >
              <span>⚙️</span> Account Settings
            </button>

          </aside>

          <section className="account-content">

            {message && (
              <div className="account-message">{message}</div>
            )}

            {activeTab === "profile" && (
              <div className="profile-section">

                <div className="section-heading">
                  <div>
                    <h2>My Profile</h2>
                    <p>Your personal and delivery information.</p>
                  </div>

                  <button
                    className="edit-profile-btn"
                    onClick={() => {
                      setEditing(!editing);
                      setMessage("");
                    }}
                  >
                    {editing ? "Cancel Editing" : "✎ Edit Profile"}
                  </button>
                </div>

                <form onSubmit={saveProfile}>

                  <div className="profile-fields">

                    <div className="account-field">
                      <label>Full Name</label>
                      <input
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        disabled={!editing}
                        required
                      />
                    </div>

                    <div className="account-field">
                      <label>Phone Number</label>
                      <input
                        name="phone"
                        type="tel"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        disabled={!editing}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="account-field">
                      <label>Email Address</label>
                      <input
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        disabled={!editing}
                        placeholder="Enter email address"
                      />
                    </div>

                    <div className="account-field">
                      <label>City</label>
                      <input
                        name="city"
                        value={profile.city}
                        onChange={handleProfileChange}
                        disabled={!editing}
                        placeholder="Enter your city"
                      />
                    </div>

                    <div className="account-field full-field">
                      <label>Delivery Platform</label>
                      <select
                        name="platform"
                        value={profile.platform}
                        onChange={handleProfileChange}
                        disabled={!editing}
                      >
                        <option>Swiggy</option>
                        <option>Zomato</option>
                        <option>Zepto</option>
                        <option>Blinkit</option>
                        <option>Other</option>
                      </select>
                    </div>

                  </div>

                  {editing && (
                    <button type="submit" className="save-account-btn">
                      Save Changes
                    </button>
                  )}

                </form>

                <div className="profile-note">
                  <span>ℹ️</span>
                  Your profile information helps FINORA personalise your
                  financial insights.
                </div>

              </div>
            )}

            {activeTab === "settings" && (
              <div className="settings-section">

                <div className="section-heading">
                  <div>
                    <h2>Account Settings</h2>
                    <p>Control your security and preferences.</p>
                  </div>
                </div>

                <div className="settings-card">
                  <h3>🔔 Notification Preferences</h3>
                  <p>Choose which notifications you want to receive.</p>

                  {[
                    ["emailNotifications", "Email Notifications", "Receive account-related updates."],
                    ["incomeAlerts", "Income Instability Alerts", "Get notified when your earnings decrease."],
                    ["expenseAlerts", "Expense Shortfall Alerts", "Get warnings about upcoming expense shortages."],
                    ["fundReminders", "Protection Fund Reminders", "Receive reminders about your savings goals."],
                  ].map(([key, title, description]) => (
                    <div className="setting-row" key={key}>
                      <div>
                        <h4>{title}</h4>
                        <p>{description}</p>
                      </div>

                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings[key]}
                          onChange={() => toggleSetting(key)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="settings-card password-card">
                  <h3>🔐 Change Password</h3>
                  <p>Keep your account secure with a strong password.</p>

                  <form onSubmit={updatePassword}>
                    <div className="account-field">
                      <label>Current Password</label>
                      <input
                        type="password"
                        name="current"
                        value={passwords.current}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                      />
                    </div>

                    <div className="account-field">
                      <label>New Password</label>
                      <input
                        type="password"
                        name="new"
                        value={passwords.new}
                        onChange={handlePasswordChange}
                        placeholder="Minimum 8 characters"
                      />
                    </div>

                    <div className="account-field">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        name="confirm"
                        value={passwords.confirm}
                        onChange={handlePasswordChange}
                        placeholder="Re-enter new password"
                      />
                    </div>

                    <button type="submit" className="save-account-btn">
                      Update Password
                    </button>
                  </form>
                </div>

                <div className="settings-card security-card">
                  <h3>🛡️ Privacy & Security</h3>
                  <p>
                    Your financial information should remain private.
                    Never share your password or verification codes.
                  </p>
                  <div className="security-status">
                    <span>Account security</span>
                    <strong>Security settings available</strong>
                  </div>
                </div>

                <div className="settings-card logout-card">
                  <div>
                    <h3>Sign Out</h3>
                    <p>Return to the FINORA login page.</p>
                  </div>
                  <button
                    className="logout-account-btn"
                    onClick={() => navigate("/login")}
                  >
                    Log Out
                  </button>
                </div>

              </div>
            )}

          </section>
        </div>

      </main>

      <footer className="account-footer">
        © 2026 FINORA. Your Income. Your Stability.
      </footer>

    </div>
  );
}

export default MyAccount;
