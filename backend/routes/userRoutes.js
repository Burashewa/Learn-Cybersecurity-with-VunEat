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

// GET /api/users/dashboard
router.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user info
    const userQuery = await pool.query(
      "SELECT id, username, email, created_at FROM users WHERE id = $1",
      [userId]
    );
    const user = userQuery.rows[0];

    if (!user) return res.status(404).json({ message: "User not found" });

    // Get stats
    const statsQuery = await pool.query(
      `
      SELECT
        COUNT(*) AS reports_submitted,
        COUNT(*) FILTER (WHERE status='approved') AS reports_approved,
        COALESCE(SUM(points), 0) AS total_points
      FROM reports
      WHERE user_id = $1
      `,
      [userId]
    );
    const stats = statsQuery.rows[0];

    // Get recent reports (limit 5)
    const reportsQuery = await pool.query(
      `
      SELECT id, title, severity, status, points, submitted_at
      FROM reports
      WHERE user_id = $1
      ORDER BY submitted_at DESC
      LIMIT 5
      `,
      [userId]
    );

    res.json({
      user,
      stats,
      recentReports: reportsQuery.rows,
    });
  } catch (err) {
    console.error("Error fetching dashboard:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
