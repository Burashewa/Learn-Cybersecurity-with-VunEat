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
 * ✅ GET all reports (for admin dashboard)
 */
router.get("/reports", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.id,
        r.title,
        r.vulnerability_type,
        r.severity,
        r.status,
        r.pdf_url AS "pdfUrl",
        r.feedback,
        r.points,
        r.submitted_at AS "submittedAt",
        r.reviewed_at AS "reviewedAt",
        u.username AS student
      FROM reports r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.submitted_at DESC;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

/**
 * ✅ PUT Approve report
 * Sets status = 'approved', updates points and reviewed_at
 */
router.put("/reports/:id/approve", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { points, feedback } = req.body; // ✅ include feedback

  try {
    const result = await pool.query(
      `
      UPDATE reports
      SET 
        status = 'approved',
        points = $1,
        feedback = COALESCE($2, feedback), -- ✅ update only if provided
        reviewed_at = NOW()
      WHERE id = $3
      RETURNING *;
      `,
      [points || 0, feedback || null, id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Report not found" });

    res.json({ message: "Report approved successfully", report: result.rows[0] });
  } catch (err) {
    console.error("Error approving report:", err);
    res.status(500).json({ error: "Failed to approve report" });
  }
});


/**
 * ✅ PUT Reject report
 * Sets status = 'rejected', updates points and reviewed_at
 */
router.put("/reports/:id/reject", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { points, feedback } = req.body; // ✅ include feedback

  try {
    const result = await pool.query(
      `
      UPDATE reports
      SET 
        status = 'rejected',
        points = $1,
        feedback = COALESCE($2, feedback), -- ✅ update only if provided
        reviewed_at = NOW()
      WHERE id = $3
      RETURNING *;
      `,
      [points || 0, feedback || null, id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Report not found" });

    res.json({ message: "Report rejected successfully", report: result.rows[0] });
  } catch (err) {
    console.error("Error rejecting report:", err);
    res.status(500).json({ error: "Failed to reject report" });
  }
});


/**
 * ✅ Optional: GET analytics summary
 * Can be used for dashboard summary boxes
 */
router.get("/reports/analytics", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'pending') AS pending,
        COUNT(*) FILTER (WHERE status = 'approved') AS approved,
        COUNT(*) FILTER (WHERE status = 'rejected') AS rejected
      FROM reports;
    `);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

module.exports = router;
