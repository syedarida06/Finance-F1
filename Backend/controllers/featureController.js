
const pool = require("../config/db");

// 1. ADD INCOME RECORD
const addIncome = async (req, res) => {
  try {
    const {
      record_date, delivery_earnings, incentives,
      fuel, maintenance, parking, mobile_data, other_expenses
    } = req.body;

    const result = await pool.query(
      `INSERT INTO income_records
      (user_id, record_date, delivery_earnings, incentives,
       fuel, maintenance, parking, mobile_data, other_expenses)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        req.user.id, record_date || new Date().toISOString().slice(0, 10),
        delivery_earnings || 0, incentives || 0,
        fuel || 0, maintenance || 0, parking || 0,
        mobile_data || 0, other_expenses || 0
      ]
    );

    res.status(201).json({
      message: "Income saved successfully",
      record: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. GET INCOME HISTORY
const getIncome = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *,
       delivery_earnings + incentives -
       fuel - maintenance - parking - mobile_data - other_expenses
       AS net_income
       FROM income_records
       WHERE user_id = $1
       ORDER BY record_date DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. ADD ESSENTIAL EXPENSE
const addExpense = async (req, res) => {
  try {
    const { category, amount, due_date } = req.body;

    if (!category || amount === undefined || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Valid category and amount are required"
      });
    }

    const result = await pool.query(
      `INSERT INTO essential_expenses
       (user_id, category, amount, due_date)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [req.user.id, category, amount, due_date || null]
    );

    res.status(201).json({
      message: "Expense saved successfully",
      expense: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. GET EXPENSES AND SHORTFALL
const getExpenses = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM essential_expenses
       WHERE user_id = $1 ORDER BY due_date ASC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. RECORD WORK INTERRUPTION
const addInterruption = async (req, res) => {
  try {
    const {
      reason, average_daily_income,
      missed_days, additional_expenses
    } = req.body;

    if (
      !reason ||
      !Number.isFinite(Number(average_daily_income)) ||
      Number(average_daily_income) < 0 ||
      !Number.isInteger(Number(missed_days)) ||
      Number(missed_days) <= 0 ||
      !Number.isFinite(Number(additional_expenses || 0)) ||
      Number(additional_expenses || 0) < 0
    ) {
      return res.status(400).json({
        message: "Please provide valid interruption details"
      });
    }

    const result = await pool.query(
      `INSERT INTO work_interruptions
       (user_id, reason, average_daily_income, missed_days, additional_expenses)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [
        req.user.id, reason, average_daily_income,
        missed_days, additional_expenses || 0
      ]
    );

    const record = result.rows[0];

    res.status(201).json({
      message: "Work interruption recorded",
      record,
      estimated_lost_income:
        Number(record.average_daily_income) * record.missed_days,
      estimated_total_impact:
        Number(record.average_daily_income) * record.missed_days +
        Number(record.additional_expenses)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. ADD PROTECTION FUND TRANSACTION
const addFundTransaction = async (req, res) => {
  try {
    const { transaction_type, amount, notes } = req.body;

    if (
      !["contribution", "withdrawal"].includes(transaction_type) ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0
    ) {
      return res.status(400).json({
        message: "Valid transaction type and positive amount required"
      });
    }

    if (transaction_type === "withdrawal") {
      const balanceResult = await pool.query(
        `SELECT COALESCE(SUM(
          CASE WHEN transaction_type = 'contribution'
          THEN amount ELSE -amount END
        ), 0) AS balance
        FROM protection_fund_transactions WHERE user_id = $1`,
        [req.user.id]
      );

      if (Number(balanceResult.rows[0].balance) < Number(amount)) {
        return res.status(400).json({
          message: "Insufficient protection fund balance"
        });
      }
    }

    const result = await pool.query(
      `INSERT INTO protection_fund_transactions
       (user_id, transaction_type, amount, notes)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [req.user.id, transaction_type, amount, notes || null]
    );

    res.status(201).json({
      message: "Protection fund transaction saved",
      transaction: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7. GET PROTECTION FUND BALANCE
const getFund = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
       COALESCE(SUM(CASE WHEN transaction_type = 'contribution'
       THEN amount ELSE -amount END), 0) AS balance
       FROM protection_fund_transactions WHERE user_id = $1`,
      [req.user.id]
    );

    res.json({
      balance: Number(result.rows[0].balance)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 8. INCOME INSTABILITY SUMMARY
const getIncomeStability = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT record_date,
       SUM(delivery_earnings + incentives -
       fuel - maintenance - parking - mobile_data - other_expenses)
       AS net_income
       FROM income_records
       WHERE user_id = $1
       AND record_date >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY record_date ORDER BY record_date`,
      [req.user.id]
    );

    const incomes = result.rows.map(row => ({
      date: row.record_date,
      net_income: Number(row.net_income)
    }));

    const average = incomes.length
      ? incomes.reduce((sum, item) => sum + item.net_income, 0) / incomes.length
      : 0;

    const latest = incomes.length
      ? incomes[incomes.length - 1].net_income
      : 0;

    res.json({
      daily_income: incomes,
      average_income: Number(average.toFixed(2)),
      latest_income: latest,
      alert: incomes.length >= 2 && latest < average * 0.7
        ? "Your latest recorded daily income is significantly below your recent average."
        : "No significant income drop detected in the available records."
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addIncome,
  getIncome,
  addExpense,
  getExpenses,
  addInterruption,
  addFundTransaction,
  getFund,
  getIncomeStability
};
