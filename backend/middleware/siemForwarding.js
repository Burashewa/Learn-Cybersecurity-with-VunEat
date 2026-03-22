/**
 * SIEM Forwarding Middleware
 *
 * Intercepts incoming requests and outgoing responses, forwarding event data
 * to a SIEM collector via fire-and-forget. Does not block the HTTP response.
 *
 * Requires: SIEM_COLLECTOR_URL (env) - e.g. ngrok HTTPS URL
 */

const STATIC_EXTENSIONS = /\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|map)(\?.*)?$/i;

/** SQLi / XSS patterns for severity escalation */
const SECURITY_PATTERNS = [
  /(\bunion\b.*\bselect\b|\bselect\b.*\bfrom\b)/i,
  /\b(OR|AND)\s+['"]?\d+['"]?\s*=\s*['"]?\d+/i,
  /['"](;|\||\\)\s*(drop|insert|update|delete|exec)/i,
  /<script[\s>]/i,
  /javascript\s*:/i,
  /on\w+\s*=\s*['"]/i,
  /<\s*iframe/i,
  /document\.(cookie|write|location)/i,
  /eval\s*\(/i,
];

/**
 * Safe JSON stringify that handles circular references
 */
function safeStringify(obj) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return "[Circular]";
      seen.add(value);
    }
    return value;
  });
}

/**
 * Extracts client IP. Prioritizes x-forwarded-for for Render/proxy deployments.
 * Render forwards the original client IP in x-forwarded-for (comma-separated chain).
 */
function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded && typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress ?? req.connection?.remoteAddress ?? "unknown";
}

/**
 * Extracts user identifier from req.user (set by identifyUser) or session.
 * Prefers email, then username, then id for attribution.
 */
function getUser(req) {
  if (req.user && typeof req.user === "object") {
    return req.user.email ?? req.user.username ?? (req.user.id != null ? String(req.user.id) : null) ?? "anonymous";
  }
  if (req.session?.user && typeof req.session.user === "object") {
    const u = req.session.user;
    return u.email ?? u.username ?? (u.id != null ? String(u.id) : null) ?? "session";
  }
  return "anonymous";
}

/**
 * Checks if payload contains suspected SQLi or XSS patterns
 */
function hasSecurityAnomaly(str) {
  if (typeof str !== "string") return false;
  return SECURITY_PATTERNS.some((re) => re.test(str));
}

/**
 * Determines severity from status code and payload content
 */
function getSeverity(statusCode, payload) {
  const payloadStr = JSON.stringify(payload ?? {});
  if (hasSecurityAnomaly(payloadStr)) return "high";
  if (statusCode >= 500) return "high";
  if (statusCode >= 400) return "medium";
  return "low";
}

/**
 * Builds the raw object (headers + URL) without circular refs
 */
function buildRaw(req) {
  const headers = {};
  if (req.headers && typeof req.headers === "object") {
    for (const [k, v] of Object.entries(req.headers)) {
      headers[k] = v;
    }
  }
  return {
    headers,
    url: req.originalUrl ?? req.url,
    method: req.method,
  };
}

/**
 * SIEM Forwarding Middleware
 * Mount early (after body parsers) so we capture body; use res.on('finish') for non-blocking.
 */
function siemForwardingMiddleware(req, res, next) {
  const collectorUrl = process.env.SIEM_COLLECTOR_URL;
  if (!collectorUrl) {
    return next();
  }

  if (STATIC_EXTENSIONS.test(req.path ?? req.url ?? "")) {
    return next();
  }

  const path = req.originalUrl ?? req.url ?? "";
  const isAuth = /login|signup|register|signin|signup/i.test(path);
  const event = isAuth ? "authentication" : "request";

  res.on("finish", () => {
    const statusCode = res.statusCode ?? 500;
    const status = statusCode < 400 ? "success" : "failed";
    const severity = getSeverity(statusCode, { body: req.body, params: req.params, query: req.query });

    const payload = {
      source: "web",
      event,
      severity,
      status,
      user: getUser(req),
      ip: getClientIp(req),
      payload: {
        body: req.body,
        params: req.params,
        query: req.query,
      },
      raw: buildRaw(req),
      response: {
        statusCode,
      },
      timestamp: new Date().toISOString(),
    };

    const body = safeStringify(payload);

    fetch(collectorUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    }).catch(() => {
      /* fire-and-forget: ignore errors to avoid logging noise */
    });
  });

  next();
}

module.exports = { siemForwardingMiddleware };
