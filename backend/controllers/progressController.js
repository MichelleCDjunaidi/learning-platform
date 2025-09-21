const pool = require("../db/connection");

const listProgressForUser = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (userId !== req.user.id)
    return res.status(403).json({ error: "Forbidden" });

  try {
    const q = `
      SELECT p.id, p.resource_id, p.status, p.percent, p.notes, p.updated_at, r.title
      FROM progress p
      JOIN resources r ON r.id = p.resource_id
      WHERE p.user_id = $1
      ORDER BY p.updated_at DESC
    `;
    const { rows } = await pool.query(q, [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch progress" });
  }
};

// Upsert progress for a resource (user-owner)
const upsertProgressForUser = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (userId !== req.user.id)
    return res.status(403).json({ error: "Forbidden" });

  const { resourceId, status, percent, notes } = req.body;
  if (!resourceId)
    return res.status(400).json({ error: "resourceId required" });

  try {
    const q = `
      INSERT INTO progress (user_id, resource_id, status, percent, notes)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, resource_id)
      DO UPDATE SET status = EXCLUDED.status, percent = EXCLUDED.percent, notes = EXCLUDED.notes, updated_at = NOW()
      RETURNING *
    `;
    const values = [
      userId,
      resourceId,
      status || null,
      percent ?? null,
      notes || null,
    ];
    const { rows } = await pool.query(q, values);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not upsert progress" });
  }
};

module.exports = { listProgressForUser, upsertProgressForUser };
