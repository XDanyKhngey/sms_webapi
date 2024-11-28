require("dotenv").config();
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.header("Authorization");

  //console.log(authHeader)

  // Check if the Authorization header exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract the token after "Bearer "

  try {
    const decoded = jwt.verify(token, String(process.env.JWT_SECRET));
    if (!decoded.userId) {
      return res.status(400).json({ error: "Invalid token payload." });
    }

    req.userId = decoded.userId; // Attach userId to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // Check for specific JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired." });
    }
    return res.status(401).json({ error: "Invalid token." });
  }
}

module.exports = verifyToken;
