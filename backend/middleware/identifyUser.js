/**
 * Lightweight user identification middleware for SIEM attribution.
 * Decodes JWT from Authorization header and attaches req.user for downstream middleware.
 * Does NOT block requests—missing or invalid tokens leave req.user unset (anonymous).
 */

const jwt = require("jsonwebtoken");

function identifyUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || typeof authHeader !== "string") {
    return next();
  }

  const parts = authHeader.trim().split(/\s+/);
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    return next();
  }

  const token = parts[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      is_admin: decoded.is_admin,
      username: decoded.username,
    };
  } catch {
    /* Invalid/expired token: do not block, leave req.user unset */
  }

  next();
}

module.exports = { identifyUser };
