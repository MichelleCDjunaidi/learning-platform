const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function authMiddleware(req, res, next) {
  const header = req.headers["authorization"] || req.headers["Authorization"];
  const token = header && header.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload should include { id, email }
    // normalize id to number
    payload.id =
      typeof payload.id === "string" ? parseInt(payload.id, 10) : payload.id;
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
