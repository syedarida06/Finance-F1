
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addIncome,
  getIncome,
  addExpense,
  getExpenses,
  addInterruption,
  addFundTransaction,
  getFund,
  getIncomeStability
} = require("../controllers/featureController");

// All routes require login
router.use(protect);

// Income tracker
router.post("/income", addIncome);
router.get("/income", getIncome);

// Expense shortfall
router.post("/expenses", addExpense);
router.get("/expenses", getExpenses);

// Emergency protection
router.post("/interruption", addInterruption);

// Protection fund
router.post("/fund", addFundTransaction);
router.get("/fund", getFund);

// Income instability
router.get("/income-stability", getIncomeStability);

module.exports = router;
