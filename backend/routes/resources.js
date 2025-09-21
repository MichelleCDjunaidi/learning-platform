const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const resourceController = require("../controllers/resourceController");

// Public
router.get("/", resourceController.listResources);
router.get("/:id", resourceController.getResource);

// Protected (requires valid JWT)
router.post("/", auth, resourceController.createResource);
router.put("/:id", auth, resourceController.updateResource);
router.delete("/:id", auth, resourceController.deleteResource);

module.exports = router;
