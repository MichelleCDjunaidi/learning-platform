const db = require("../db/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//registration
const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
      email,
      hashed,
    ]);
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
};

//login
const login = async (req, res) => {
  //given
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    // store password as hashed with bcrypt
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

//exported to auth.js
module.exports = { register, login };
