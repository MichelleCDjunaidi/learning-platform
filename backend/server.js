const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
//check connection to DB
const db = require("./db/connection");

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Routes
app.use("/auth", require("./routes/auth"));
// app.use("/resources", require("./routes/resources"));
// app.use("/progress", require("./routes/progress"));
// app.use("/search", require("./routes/search"));

// Health check
app.get("/", (req, res) => res.send("🚀 Backend is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
