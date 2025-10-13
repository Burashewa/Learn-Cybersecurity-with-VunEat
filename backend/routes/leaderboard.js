// routes/leaderboard.js
const express = require("express");
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const router = express.Router();

// GET leaderboard
router.get("/leaderboardList", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id AS user_id, 
        u.username, 
        COALESCE(SUM(r.points), 0) AS total_points
      FROM users u
      LEFT JOIN reports r 
        ON u.id = r.user_id 
        AND r.status = 'approved'
      WHERE u.is_admin = false   -- ✅ Exclude admin users
      GROUP BY u.id, u.username
      ORDER BY total_points DESC, u.username ASC
      LIMIT 50
    `);

    // Map results to include rank
    const leaderboard = result.rows.map((row, index) => ({
      rank: index + 1,
      userId: row.user_id,
      username: row.username,
      totalPoints: parseInt(row.total_points, 10),
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
