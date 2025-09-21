const pool = require("../db/connection");

const listSavedResources = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  // don't modify other people's saved content
  if (userId !== req.user.id)
    return res.status(403).json({ error: "Forbidden" });

  try {
    const q = `
      SELECT r.id, r.title, r.url, r.source, sr.created_at AS saved_at
      FROM saved_resources sr
      JOIN resources r ON sr.resource_id = r.id
      WHERE sr.user_id = $1
      ORDER BY sr.created_at DESC
    `;
    const { rows } = await pool.query(q, [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch saved resources" });
  }
};

const addSavedResource = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (userId !== req.user.id)
    return res.status(403).json({ error: "Forbidden" });

  const { resourceId } = req.body;
  if (!resourceId)
    return res.status(400).json({ error: "resourceId required" });
  try {
    await pool.query(
      `INSERT INTO saved_resources (user_id, resource_id) VALUES ($1, $2) ON CONFLICT (user_id, resource_id) DO NOTHING`,
      [userId, resourceId]
    );
    res.status(201).json({ message: "Saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save resource" });
  }
};

const removeSavedResource = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const resourceId = parseInt(req.params.resourceId, 10);
  if (userId !== req.user.id)
    return res.status(403).json({ error: "Forbidden" });

  try {
    await pool.query(
      "DELETE FROM saved_resources WHERE user_id = $1 AND resource_id = $2",
      [userId, resourceId]
    );
    res.json({ message: "Removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not remove saved resource" });
  }
};

module.exports = { listSavedResources, addSavedResource, removeSavedResource };
