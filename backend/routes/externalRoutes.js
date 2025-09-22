const express = require("express");
const router = express.Router();
const { searchYoutube } = require("../controllers/externalController");
const auth = require("../middleware/auth");

// let's only let logged people search
router.get("/youtube", auth, searchYoutube);

module.exports = router;
