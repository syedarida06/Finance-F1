const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const featureRoutes = require("./routes/featureRoutes");
require("dotenv").config();

const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/features", featureRoutes);

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to FINORA Backend!",
    status: "Server is running successfully",
  });
});

// Database connection test
app.get("/api/health/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.status(200).json({
      message: "PostgreSQL connected successfully!",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`FINORA Backend running on port ${PORT}`);
});