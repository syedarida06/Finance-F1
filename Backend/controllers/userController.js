
const pool = require("../config/db");

// GET LOGGED-IN USER PROFILE
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT
        id,
        full_name,
        phone,
        email,
        platform,
        city,
        created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User profile not found"
      });
    }

    res.status(200).json({
      message: "Profile retrieved successfully",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("Profile error:", error.message);

    res.status(500).json({
      message: "Server error while retrieving profile"
    });
  }
};

module.exports = { getUserProfile };
