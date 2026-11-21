
const pool = require("../config/db");

// 1. ADD INCOME RECORD
const addIncome = async (req, res) => {
  try {
    const {
      record_date,
      delivery_earnings,
      incentives,
      fuel,
      maintenance,
      parking,
      mobile_data,
      other_expenses
    } = req.body;

    const amounts = [
      delivery_earnings, incentives, fuel, maintenance,
      parking, mobile_data, other_expenses
    ];

    if (
      delivery_earnings === undefined ||
      amounts.some(value =>
        value !== undefined &&
        (!Number.isFinite(Number(value)) || Number(value) < 0)
      )
    ) {
      return res.status(400).json({
        message: "Please provide valid non-negative income and expense amounts."
      });
    }

    const result = await pool.query(
      `INSERT INTO income_records
      (user_id, record_date, delivery_earnings, incentives,
       fuel, maintenance, parking, mobile_data, other_expenses)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        req.user.id,
        record_date || new Date().toISOString().slice(0, 10),
        Number(delivery_earnings),
        Number(incentives || 0),
        Number(fuel || 0),
        Number(maintenance || 0),
        Number(parking || 0),
        Number(mobile_data || 0),
        Number(other_expenses || 0)
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
       ORDER BY record_date DESC, id DESC`,
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

    if (
      !category ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0
    ) {
      return res.status(400).json({
        message: "Valid category and positive amount are required."
      });
    }

    const result = await pool.query(
      `INSERT INTO essential_expenses
       (user_id, category, amount, due_date)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [req.user.id, category, Number(amount), due_date || null]
    );

    res.status(201).json({
      message: "Expense saved successfully",
      expense: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. GET ESSENTIAL EXPENSES
const getExpenses = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM essential_expenses
       WHERE user_id = $1
       ORDER BY due_date ASC NULLS LAST, id DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. ADD WORK INTERRUPTION
const addInterruption = async (req, res) => {
  try {
    const {
      reason,
      average_daily_income,
      missed_days,
      additional_expenses
    } = req.body;

    if (
      !reason ||
      average_daily_income === undefined ||
      !Number.isFinite(Number(average_daily_income)) ||
      Number(average_daily_income) < 0 ||
      !Number.isInteger(Number(missed_days)) ||
      Number(missed_days) <= 0 ||
      !Number.isFinite(Number(additional_expenses || 0)) ||
      Number(additional_expenses || 0) < 0
    ) {
      return res.status(400).json({
        message: "Please provide valid interruption details."
      });
    }

    const result = await pool.query(
      `INSERT INTO work_interruptions
       (user_id, reason, average_daily_income, missed_days, additional_expenses)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [
        req.user.id,
        reason,
        Number(average_daily_income),
        Number(missed_days),
        Number(additional_expenses || 0)
      ]
    );

    const record = result.rows[0];

    const lostIncome =
      Number(record.average_daily_income) * Number(record.missed_days);

    res.status(201).json({
      message: "Work interruption recorded",
      record,
      estimated_lost_income: lostIncome,
      estimated_total_impact:
        lostIncome + Number(record.additional_expenses)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. GET WORK INTERRUPTION HISTORY
const getInterruptions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM work_interruptions
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7. ADD PROTECTION FUND TRANSACTION
const addFundTransaction = async (req, res) => {
  try {
    const { transaction_type, amount, notes } = req.body;

    if (
      !["contribution", "withdrawal"].includes(transaction_type) ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0
    ) {
      return res.status(400).json({
        message: "Valid transaction type and positive amount are required."
      });
    }

    if (transaction_type === "withdrawal") {
      const balanceResult = await pool.query(
        `SELECT COALESCE(SUM(
          CASE
            WHEN transaction_type = 'contribution' THEN amount
            ELSE -amount
          END
        ), 0) AS balance
        FROM protection_fund_transactions
        WHERE user_id = $1`,
        [req.user.id]
      );

      if (Number(balanceResult.rows[0].balance) < Number(amount)) {
        return res.status(400).json({
          message: "Insufficient protection fund balance."
        });
      }
    }

    const result = await pool.query(
      `INSERT INTO protection_fund_transactions
       (user_id, transaction_type, amount, notes)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [req.user.id, transaction_type, Number(amount), notes || null]
    );

    res.status(201).json({
      message: "Protection fund transaction saved",
      transaction: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 8. GET PROTECTION FUND BALANCE
const getFund = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COALESCE(SUM(
        CASE
          WHEN transaction_type = 'contribution' THEN amount
          ELSE -amount
        END
      ), 0) AS balance
      FROM protection_fund_transactions
      WHERE user_id = $1`,
      [req.user.id]
    );

    res.json({
      balance: Number(result.rows[0].balance)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 9. INCOME INSTABILITY SUMMARY - LAST 30 DAYS
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
       GROUP BY record_date
       ORDER BY record_date ASC`,
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

    const hasAlert = incomes.length >= 2 && latest < average * 0.7;

    res.json({
      daily_income: incomes,
      average_income: Number(average.toFixed(2)),
      latest_income: latest,
      has_alert: hasAlert,
      alert: hasAlert
        ? "Your latest recorded daily income is significantly below your recent average."
        : "No significant income drop detected in the available records."
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 10. CREDITBRIDGE - FINANCIAL PROFILE
const getCreditBridge = async (req, res) => {
  try {
    const userId = req.user.id;

    // Last 6 months of income records
    const incomeResult = await pool.query(
      `SELECT
         TO_CHAR(DATE_TRUNC('month', record_date), 'YYYY-MM') AS month,
         SUM(delivery_earnings + incentives) AS gross_income,
         SUM(fuel + maintenance + parking + mobile_data + other_expenses)
           AS work_expenses,
         SUM(delivery_earnings + incentives -
             fuel - maintenance - parking - mobile_data - other_expenses)
           AS net_income,
         COUNT(*) AS record_count
       FROM income_records
       WHERE user_id = $1
       AND record_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months'
       GROUP BY DATE_TRUNC('month', record_date)
       ORDER BY DATE_TRUNC('month', record_date) ASC`,
      [userId]
    );

    const history = incomeResult.rows.map(row => ({
      month: row.month,
      gross_income: Number(row.gross_income),
      work_expenses: Number(row.work_expenses),
      net_income: Number(row.net_income),
      record_count: Number(row.record_count)
    }));

    const monthsWithRecords = history.length;

    const averageMonthlyIncome = monthsWithRecords
      ? history.reduce((sum, item) => sum + item.net_income, 0) /
        monthsWithRecords
      : 0;

    const averageMonthlyWorkExpenses = monthsWithRecords
      ? history.reduce((sum, item) => sum + item.work_expenses, 0) /
        monthsWithRecords
      : 0;

    // Income consistency indicator
    let incomeConsistency = null;

    if (monthsWithRecords >= 2 && averageMonthlyIncome > 0) {
      const variance = history.reduce(
        (sum, item) =>
          sum + Math.pow(item.net_income - averageMonthlyIncome, 2),
        0
      ) / monthsWithRecords;

      const standardDeviation = Math.sqrt(variance);

      incomeConsistency = Math.max(
        0,
        Math.min(
          100,
          Number(
            (100 - (standardDeviation / averageMonthlyIncome) * 100)
              .toFixed(1)
          )
        )
      );
    }

    // Essential expenses due in the current month
    const expenseResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total
       FROM essential_expenses
       WHERE user_id = $1
       AND due_date >= DATE_TRUNC('month', CURRENT_DATE)::date
       AND due_date < (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')::date`,
      [userId]
    );

    const currentMonthEssentialExpenses =
      Number(expenseResult.rows[0].total);

    // Protection Fund balance
    const fundResult = await pool.query(
      `SELECT COALESCE(SUM(
         CASE
           WHEN transaction_type = 'contribution' THEN amount
           ELSE -amount
         END
       ), 0) AS balance
       FROM protection_fund_transactions
       WHERE user_id = $1`,
      [userId]
    );

    const protectionFundBalance = Number(fundResult.rows[0].balance);

    const estimatedSurplus =
      averageMonthlyIncome - currentMonthEssentialExpenses;

    res.json({
      average_monthly_income: Number(averageMonthlyIncome.toFixed(2)),
      average_monthly_work_expenses:
        Number(averageMonthlyWorkExpenses.toFixed(2)),
      income_consistency: incomeConsistency,
      months_with_records: monthsWithRecords,
      current_month_essential_expenses:
        Number(currentMonthEssentialExpenses.toFixed(2)),
      estimated_surplus:
        Number(estimatedSurplus.toFixed(2)),
      protection_fund_balance:
        Number(protectionFundBalance.toFixed(2)),
      income_history: history,
      message: monthsWithRecords < 2
        ? "Add income records across at least two months to assess income consistency."
        : "Financial profile calculated from your saved FINORA records."
    });

  } catch (error) {
    console.error("CreditBridge error:", error);
    res.status(500).json({
      message: "Unable to generate your financial profile."
    });
  }
};

module.exports = {
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
};
