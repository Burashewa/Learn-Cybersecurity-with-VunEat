import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid token format" });
  }
  const token = parts[1];


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query("SELECT id, email, is_admin, status FROM users WHERE id = $1", [decoded.id]);
    const user = result.rows[0];

    if (!user) return res.status(404).json({ message: "User not found" });

    // 🚫 Block inactive users
    if (user.status === "inactive") {
      return res.status(403).json({ message: "Your account is deactivated. Contact admin." });
    }

    req.user = {
      id: user.id,
      email: user.email,
      is_admin: user.is_admin,
    };

    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}
