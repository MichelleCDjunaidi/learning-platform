// backend/routes/users.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// better options
router.use("/:userId/saved_resources", require("./savedResources"));
router.use("/:userId/progress", require("./progress"));

module.exports = router;
