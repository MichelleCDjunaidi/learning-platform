const pool = require("../db/connection");

// For every resource we do have
// List resources (public)
const listResources = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, title, url, source, created_at FROM resources ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch resources" });
  }
};

// Get single resource (public)
const getResource = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { rows } = await pool.query(
      "SELECT id, title, url, source, created_at FROM resources WHERE id = $1",
      [id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Resource not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch resource" });
  }
};

// Create resource (auth)
const createResource = async (req, res) => {
  try {
    const { title, url, source } = req.body;
    if (!title || !url)
      return res.status(400).json({ error: "title and url required" });

    const { rows } = await pool.query(
      "INSERT INTO resources (title, url, source) VALUES ($1, $2, $3) RETURNING id, title, url, source, created_at",
      [title, url, source || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create resource" });
  }
};

// Update resource (auth)
const updateResource = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, url, source } = req.body;
    const { rows } = await pool.query(
      "UPDATE resources SET title = $1, url = $2, source = $3 WHERE id = $4 RETURNING id, title, url, source, created_at",
      [title, url, source || null, id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Resource not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update resource" });
  }
};

// Delete resource (auth)
const deleteResource = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await pool.query("DELETE FROM resources WHERE id = $1", [id]);
    res.json({ message: "Resource deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete resource" });
  }
};

module.exports = {
  listResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
};
