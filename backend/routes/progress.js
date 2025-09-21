const express = require("express");
const router = express.Router({ mergeParams: true });
const auth = require("../middleware/auth");
const {
  listProgressForUser,
  upsertProgressForUser,
} = require("../controllers/progressController");

// GET /api/users/:userId/progress
router.get("/", auth, listProgressForUser);
// POST /api/users/:userId/progress   (upsert)
router.post("/", auth, upsertProgressForUser);

module.exports = router;
