const express = require("express");
const { Pool } = require("pg");
const dotenv = require("dotenv");
const { authenticateToken } = require("../middleware/authMiddleware");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const router = express.Router();

// 🟢 GET all vulnerabilities
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vulnerability_list ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching vulnerabilities:", error);
    res.status(500).json({ message: "Server error fetching vulnerabilities" });
  }
});

// 🟡 ADD new vulnerability
router.post("/", authenticateToken, async (req, res) => {
  const { title, severity } = req.body;

  if (!title || !severity) {
    return res.status(400).json({ message: "Title and severity are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO vulnerability_list (title, severity) VALUES ($1, $2) RETURNING *",
      [title, severity]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding vulnerability:", error);
    res.status(500).json({ message: "Server error adding vulnerability" });
  }
});

// 🟠 UPDATE vulnerability
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, severity } = req.body;

  if (!title || !severity) {
    return res.status(400).json({ message: "Title and severity are required" });
  }

  try {
    const result = await pool.query(
      "UPDATE vulnerability_list SET title = $1, severity = $2 WHERE id = $3 RETURNING *",
      [title, severity, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Vulnerability not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating vulnerability:", error);
    res.status(500).json({ message: "Server error updating vulnerability" });
  }
});

// 🔴 DELETE vulnerability
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM vulnerability_list WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Vulnerability not found" });
    }

    res.json({ message: "Vulnerability deleted successfully" });
  } catch (error) {
    console.error("Error deleting vulnerability:", error);
    res.status(500).json({ message: "Server error deleting vulnerability" });
  }
});

module.exports = router;
