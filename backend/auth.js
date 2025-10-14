const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// PostgreSQL pool (for Neon)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.use(
  cors({
    origin:[ "http://localhost:3000", "https://learn-cybersecurity-with-vun-eat.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());

// --------------------------- Mount routes
const velnerablityList = require("./routes/vulnerabilityRoutes");
const submitReportRoutes = require("./routes/reports/submitReportRoutes");
const reportRoutes = require("./routes/reports/reportRoutes");
const userRoutes = require("./routes/userRoutes");
const leaderboard = require("./routes/leaderboard");
const adminRoutes = require("./routes/adminRoutes");
const adminReportsRoutes = require("./routes/adminReportsRoutes");
const vulnerabilityRoutes = require("./routes/adminVulnerabilities");
const adminUsersRoutes = require("./routes/adminUsers");

app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/vulnerabilities", vulnerabilityRoutes);
app.use("/api/admin", adminReportsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/leaderboard", leaderboard);
app.use("/api/velnerablity", velnerablityList);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", submitReportRoutes);

// --------------------------- Helpers
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, is_admin: user.is_admin },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
}

// --------------------------- Register
app.post("/api/register", async (req, res) => {
  const { username, email, password, is_admin = false } = req.body;
  try {
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, email, password, is_admin)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, is_admin, status`,
      [username, email, hashedPassword, is_admin]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------------- Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userResult.rows[0];
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // 🚫 Status check
    if (user.status === "inactive") {
      return res.status(403).json({ message: "Your account is deactivated. Please contact the admin." });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
        status: user.status,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------------- Admin-only test route
app.get("/api/admin", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    if (!decoded.is_admin) return res.status(403).json({ message: "Admins only!" });

    res.json({ message: "Welcome, Admin!" });
  });
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

module.exports = { app, pool };
