
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// USER REGISTRATION
const registerUser = async (req, res) => {
  try {
    const {
      full_name,
      phone,
      email,
      password,
      platform,
      city
    } = req.body;

    // Check required fields
    if (!full_name || !phone || !email || !password) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters"
      });
    }

    // Check whether email already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Email is already registered"
      });
    }

    // Securely hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users
       (full_name, phone, email, password_hash, platform, city)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, full_name, phone, email, platform, city, created_at`,
      [
        full_name,
        phone,
        email,
        hashedPassword,
        platform || null,
        city || null
      ]
    );

    res.status(201).json({
      message: "Registration successful!",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("Registration error:", error.message);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Email is already registered"
      });
    }

    res.status(500).json({
      message: "Server error during registration"
    });
  }
};


// USER LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user by email
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        platform: user.platform,
        city: user.city
      }
    });

  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Server error during login"
    });
  }
};


// EXPORT BOTH FUNCTIONS
module.exports = {
  registerUser,
  loginUser
};
