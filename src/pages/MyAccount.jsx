
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MyAccount.css";

const API_URL = "http://localhost:5000/api/users";

function MyAccount() {
  const navigate = useNavigate();
  const location = useLocation();

  const requestedTab = location.state?.tab;
  const [activeTab, setActiveTab] = useState(
    requestedTab === "settings" ? "settings" : "profile"
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    platform: "",
    memberSince: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("finoraToken");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
          localStorage.removeItem("finoraToken");
          localStorage.removeItem("finoraUser");
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Unable to load your profile.");
        }

        const user = data.user;

        if (!user) {
          throw new Error("Profile information was not returned.");
        }

        setProfile({
          name: user.full_name || "",
          phone: user.phone || "",
          email: user.email || "",
          city: user.city || "",
          platform: user.platform || "",
          memberSince: user.created_at
            ? new Date(user.created_at).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })
            : "Not available",
        });
      } catch (err) {
        setError(err.message || "Unable to load your account.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("finoraToken");
    localStorage.removeItem("finoraUser");
    navigate("/login", { replace: true });
  };

  return (
    <div className="account-page">
      <nav className="account-navbar">
        <div
          className="account-logo"
          onClick={() => navigate("/user-dashboard")}
        >
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
          <p>
            View your registered information and manage your account access.
          </p>
        </div>

        {loading ? (
          <p>Loading your account...</p>
        ) : error ? (
          <div className="account-message">{error}</div>
        ) : (
          <div className="account-layout">
            <aside className="account-sidebar">
              <div className="account-avatar">
                {profile.name.trim().charAt(0).toUpperCase() || "U"}
              </div>

              <h3>{profile.name || "Delivery Partner"}</h3>
              <p>{profile.email || "No email available"}</p>

              <button
                className={
                  activeTab === "profile"
                    ? "account-tab active"
                    : "account-tab"
                }
                onClick={() => setActiveTab("profile")}
              >
                <span>👤</span> My Profile
              </button>

              <button
                className={
                  activeTab === "settings"
                    ? "account-tab active"
                    : "account-tab"
                }
                onClick={() => setActiveTab("settings")}
              >
                <span>⚙️</span> Account Settings
              </button>
            </aside>

            <section className="account-content">
              {activeTab === "profile" && (
                <div className="profile-section">
                  <div className="section-heading">
                    <div>
                      <h2>My Profile</h2>
                      <p>Your registered personal and delivery information.</p>
                    </div>
                  </div>

                  <div className="profile-fields">
                    <div className="account-field">
                      <label>Full Name</label>
                      <input value={profile.name} readOnly />
                    </div>

                    <div className="account-field">
                      <label>Phone Number</label>
                      <input value={profile.phone} readOnly />
                    </div>

                    <div className="account-field">
                      <label>Email Address</label>
                      <input value={profile.email} readOnly />
                    </div>

                    <div className="account-field">
                      <label>City</label>
                      <input value={profile.city || "Not provided"} readOnly />
                    </div>

                    <div className="account-field full-field">
                      <label>Delivery Platform</label>
                      <input
                        value={profile.platform || "Not provided"}
                        readOnly
                      />
                    </div>

                    <div className="account-field full-field">
                      <label>Member Since</label>
                      <input value={profile.memberSince} readOnly />
                    </div>
                  </div>

                  <div className="profile-note">
                    <span>ℹ️</span>
                    Your account information is retrieved from your FINORA
                    database profile.
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="settings-section">
                  <div className="section-heading">
                    <div>
                      <h2>Account Settings</h2>
                      <p>Manage your account access and security.</p>
                    </div>
                  </div>

                  <div className="settings-card security-card">
                    <h3>🛡️ Account Security</h3>
                    <p>
                      Your account uses authenticated login. Your financial
                      information is associated with your registered account.
                    </p>

                    <div className="security-status">
                      <span>Login authentication</span>
                      <strong>Enabled</strong>
                    </div>

                    <div className="security-status">
                      <span>Account email</span>
                      <strong>{profile.email || "Not available"}</strong>
                    </div>
                  </div>

                  <div className="settings-card logout-card">
                    <div>
                      <h3>Sign Out</h3>
                      <p>
                        Securely end your current FINORA session.
                      </p>
                    </div>

                    <button
                      className="logout-account-btn"
                      onClick={logout}
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      <footer className="account-footer">
        © 2026 FINORA. Your Income. Your Stability.
      </footer>
    </div>
  );
}

export default MyAccount;
