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

/**
 * GET /api/admin/users
 * Fetch all users with report count and total points
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.status,
        u.created_at AS "joinDate",
        u.is_admin,
        COALESCE(SUM(r.points), 0) AS "totalPoints",
        COUNT(r.id) AS "reportsSubmitted"
      FROM users u
      LEFT JOIN reports r ON u.id = r.user_id
      WHERE u.is_admin = false 
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/**
 * PUT /api/admin/users/:id/toggle-status
 * Activate or deactivate user
 */
router.put("/:id/toggle-status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT status FROM users WHERE id = $1", [id]);

    if (user.rows.length === 0) return res.status(404).json({ message: "User not found" });

    const newStatus = user.rows[0].status === "active" ? "inactive" : "active";

    await pool.query("UPDATE users SET status = $1 WHERE id = $2", [newStatus, id]);

    res.json({ message: `User status updated to ${newStatus}` });
  } catch (error) {
    console.error("❌ Error updating user status:", error);
    res.status(500).json({ message: "Failed to update user status" });
  }
});

/**
 * PUT /api/admin/users/:id/adjust-points
 * Adjust user’s total report points (by updating latest report)
 */
router.put("/:id/adjust-points", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { adjustment } = req.body;

    // Get user’s current total points
    const current = await pool.query(
      `SELECT COALESCE(SUM(points), 0) AS total FROM reports WHERE user_id = $1`,
      [id]
    );

    if (current.rows.length === 0)
      return res.status(404).json({ message: "User not found or has no reports" });

    const newPoints = Math.max(
      0,
      Number(current.rows[0].total) + Number(adjustment)
    );


    // Apply adjustment to the most recent report for simplicity
    const latestReport = await pool.query(
      `SELECT id FROM reports WHERE user_id = $1 ORDER BY submitted_at DESC LIMIT 1`,
      [id]
    );

    if (latestReport.rows.length > 0) {
      await pool.query("UPDATE reports SET points = $1 WHERE id = $2", [
        newPoints,
        latestReport.rows[0].id,
      ]);
    } else {
      // If user has no reports, create a dummy one to hold points
      await pool.query(
        "INSERT INTO reports (user_id, title, severity, status, points, vulnerability_type, description) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [id, "Manual Points Adjustment", "low", "approved", newPoints, "manual", "Admin adjustment"]
      );
    }

    res.json({ message: `User points adjusted successfully`, newPoints });
  } catch (error) {
    console.error("❌ Error adjusting points:", error);
    res.status(500).json({ message: "Failed to adjust points" });
  }
});

/**
 * POST /api/admin/users/:id/reset-password
 * Simulate sending a password reset link
 */
router.post("/:id/reset-password", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT email FROM users WHERE id = $1", [id]);
    if (user.rows.length === 0) return res.status(404).json({ message: "User not found" });

    // In real implementation, email service would be called here
    res.json({ message: `Password reset link sent to ${user.rows[0].email}` });
  } catch (error) {
    console.error("❌ Error resetting password:", error);
    res.status(500).json({ message: "Failed to send password reset link" });
  }
});

/**
 * GET /api/admin/users/:id
 * Get detailed user info + reports summary
 */
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await pool.query(
      `SELECT id, username, email, status, created_at AS "joinDate", is_admin 
       FROM users WHERE id = $1`,
      [id]
    );

    if (user.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const reports = await pool.query(
      `SELECT id, title, severity, status, points, submitted_at, vulnerability_type
       FROM reports WHERE user_id = $1 ORDER BY submitted_at DESC`,
      [id]
    );

    res.json({ ...user.rows[0], reports: reports.rows });
  } catch (error) {
    console.error("❌ Error fetching user details:", error);
    res.status(500).json({ message: "Failed to fetch user details" });
  }
});

module.exports = router;
