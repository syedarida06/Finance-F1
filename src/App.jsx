
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import UserDashboard from "./pages/UserDashboard";

import IncomeTracker from "./pages/IncomeTracker";
import IncomeInstability from "./pages/IncomeInstability";
import ExpenseShortfall from "./pages/ExpenseShortfall";
import EmergencyProtection from "./pages/EmergencyProtection";
import ProtectionFund from "./pages/ProtectionFund";
import IncomeSimulator from "./pages/IncomeSimulator";

import MyAccount from "./pages/MyAccount";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home Page */}
        <Route path="/" element={<Dashboard />} />

        {/* Authentication Pages */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />

        {/* User Dashboard */}
        <Route path="/user-dashboard" element={<UserDashboard />} />

        {/* FINORA Features */}
        <Route path="/income-tracker" element={<IncomeTracker />} />
        <Route path="/income-instability" element={<IncomeInstability />} />
        <Route path="/expense-shortfall" element={<ExpenseShortfall />} />
        <Route path="/emergency-protection" element={<EmergencyProtection />} />
        <Route path="/protection-fund" element={<ProtectionFund />} />

        {/* Income Simulator */}
        <Route path="/income-simulator" element={<IncomeSimulator />} />

        {/* My Profile & Account Settings */}
        <Route path="/my-account" element={<MyAccount />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
