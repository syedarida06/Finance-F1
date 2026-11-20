
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    // Get token from request header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. Please login first."
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store logged-in user ID
    req.user = {
      id: decoded.id
    };

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token. Please login again."
    });
  }
};

module.exports = protect;
