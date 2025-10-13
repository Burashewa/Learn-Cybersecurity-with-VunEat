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

// ✅ 1. Dashboard Overview
router.get("/dashboard-stats", authenticateToken, async (req, res) => {
  try {
    const totalUsers = await pool.query("SELECT COUNT(*) FROM users WHERE is_admin = false ");
    const totalReports = await pool.query("SELECT COUNT(*) FROM reports");
    const pendingReports = await pool.query("SELECT COUNT(*) FROM reports WHERE status = 'pending'");

    res.json({
      totalUsers: totalUsers.rows[0].count,
      totalReports: totalReports.rows[0].count,
      pendingReports: pendingReports.rows[0].count,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Server error fetching stats" });
  }
});

// ✅ 2. Get all pending reports
router.get("/pending-reports", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.title, r.severity, r.submitted_at, u.username AS student
       FROM reports r
       JOIN users u ON r.user_id = u.id
       WHERE r.status = 'pending'
       ORDER BY r.submitted_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching pending reports:", error);
    res.status(500).json({ error: "Server error fetching pending reports" });
  }
});

// ✅ 3. Approve or Reject Report
router.put("/report/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // expected "approved" or "rejected"

  try {
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const update = await pool.query(
      "UPDATE reports SET status = $1, reviewed_at = NOW() WHERE id = $2 RETURNING *",
      [status, id]
    );

    // If approved, add points to user
    if (status === "approved") {
      await pool.query(
        `UPDATE users 
         SET points = points + 50 
         WHERE id = (SELECT user_id FROM reports WHERE id = $1)`,
        [id]
      );
    }

    res.json({ message: `Report ${status} successfully`, report: update.rows[0] });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ error: "Server error updating report" });
  }
});

// ✅ 4. Leaderboard Summary
router.get("/leaderboard", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id AS user_id, u.username, COALESCE(SUM(r.points), 0) AS total_points
      FROM users u
       LEFT JOIN reports r 
      ON u.id = r.user_id AND r.status = 'approved'
     WHERE u.is_admin = false 
     GROUP BY u.id, u.username
     ORDER BY total_points DESC, u.username ASC
     LIMIT 50`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Server error fetching leaderboard" });
  }
});

//✅ 5. Report analitics
router.get("/analytics/reports", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(submitted_at, 'Mon') AS month,
        COUNT(*) FILTER (WHERE status = 'pending') AS pending,
        COUNT(*) FILTER (WHERE status = 'approved') AS approved,
        COUNT(*) AS total
      FROM reports
      GROUP BY month
      ORDER BY MIN(submitted_at)
    `)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Error fetching report analytics" })
  }
})

// ✅ 6. User Management
router.get("/users", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, is_admin, status FROM users ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error fetching users" });
  }
});

router.put("/users/:id/toggle", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await pool.query("SELECT status FROM users WHERE id = $1", [id]);
    if (user.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const newStatus = user.rows[0].status === "active" ? "inactive" : "active";
    await pool.query("UPDATE users SET status = $1 WHERE id = $2", [newStatus, id]);

    res.json({ message: `User ${newStatus} successfully`, newStatus });
  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json({ error: "Server error updating user status" });
  }
});

module.exports = router;
