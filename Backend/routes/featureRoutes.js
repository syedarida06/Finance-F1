
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addIncome,
  getIncome,
  addExpense,
  getExpenses,
  addInterruption,
  getInterruptions,
  addFundTransaction,
  getFund,
  getIncomeStability,
  getCreditBridge
} = require("../controllers/featureController");

// All feature routes require authentication
router.use(protect);

// Income Tracker
router.post("/income", addIncome);
router.get("/income", getIncome);

// Essential Expense Shortfall
router.post("/expenses", addExpense);
router.get("/expenses", getExpenses);

// Workday Loss & Emergency Protection
router.post("/interruption", addInterruption);
router.get("/interruption", getInterruptions);

// Protection Fund
router.post("/fund", addFundTransaction);
router.get("/fund", getFund);

// Income Instability
router.get("/income-stability", getIncomeStability);

// CreditBridge
router.get("/credit-bridge", getCreditBridge);

module.exports = router;
