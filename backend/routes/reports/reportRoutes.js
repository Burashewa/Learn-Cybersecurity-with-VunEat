// routes/reports.js
const express = require("express");
const { Pool } = require("pg");
const dotenv = require("dotenv");
const { authenticateToken } = require("../../middleware/authMiddleware");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const router = express.Router();

// Get reports of the logged-in user
router.get("/reportsPage", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const result = await pool.query(
      `SELECT id, title, vulnerability_type, severity, status, points,
              submitted_at, reviewed_at, feedback
       FROM reports
       WHERE user_id = $1
       ORDER BY submitted_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ CommonJS export
module.exports = router;
