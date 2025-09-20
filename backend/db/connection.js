const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test DB connection on startup
(async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Connected to Postgres at:", result.rows[0].now);
  } catch (err) {
    console.error("❌ Failed to connect to Postgres:", err.message);
    process.exit(1); // Stop app if DB is unreachable
  }
})();

module.exports = pool;
