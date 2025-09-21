// for students to save content
const express = require("express");
const router = express.Router({ mergeParams: true }); // important for :userId
const auth = require("../middleware/auth");
const { listSavedResources, addSavedResource, removeSavedResource } = require("../controllers/savedResourceController");

// GET /api/users/:userId/saved_resources
router.get("/", auth, listSavedResources);
// POST /api/users/:userId/saved_resources
router.post("/", auth, addSavedResource);
// DELETE /api/users/:userId/saved_resources/:resourceId
router.delete("/:resourceId", auth, removeSavedResource);

module.exports = router;
