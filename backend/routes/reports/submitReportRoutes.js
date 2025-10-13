const express = require("express");
const { Pool } = require("pg");
const dotenv = require("dotenv");
const {upload, makePublic} = require("../../middleware/upload");
const { authenticateToken } = require("../../middleware/authMiddleware");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const router = express.Router();

// Submit new report with PDF
router.post("/reportSubmit", authenticateToken, upload.single("pdfFile"),makePublic, async (req, res) => {
  try {
    const { title, vulnerabilityType, severity, description } = req.body;
    const pdfUrl = req.file.path; // Cloudinary URL

    if (!pdfUrl) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    const result = await pool.query(
      `INSERT INTO reports (user_id, title, vulnerability_type, severity, description, pdf_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, title, vulnerabilityType, severity, description, pdfUrl]
    );

    res.status(201).json({ message: "Report submitted successfully", report: result.rows[0] });
  } catch (err) {
    console.error("Error submitting report:", err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
