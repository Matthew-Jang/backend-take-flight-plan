// app/authorization/authorization.js

const db      = require("../models");
const Session = db.session;
const User    = db.user;

/**
 * Middleware: validate the Bearer token, ensure session isn't expired,
 * then look up the User to attach their role.
 */
async function authenticate(req, res, next) {
  const authHeader = req.get("authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized! No Auth Header" });
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Unauthorized! Invalid Auth Header" });
  }

  try {
    // 1) find the session record
    const session = await Session.findOne({ where: { token } });
    if (!session) {
      return res.status(401).json({ message: "Unauthorized! Invalid token" });
    }

    // 2) check expiration
    const expiry = new Date(session.expirationDate).getTime();
    if (expiry < Date.now()) {
      return res
        .status(401)
        .json({ message: "Unauthorized! Expired token – please log in again." });
    }

    // 3) load the user so we can grab their role
    const user = await User.findByPk(session.userId, {
      attributes: ["id","role"]
    });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized! User not found." });
    }

    // 4) attach for downstream use
    req.userId   = user.id;
    req.userRole = user.role;   // 0 = default/student, 1 = admin, 2 = staff
    next();

  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
}

/**
 * Only allow users whose role ≥ 1 (i.e. admins and staff).
 */
function requireAdmin(req, res, next) {
  if (req.userRole == null || req.userRole < 1) {
    return res.status(403).json({ message: "Forbidden: admins only." });
  }
  next();
}

/**
 * Only allow users whose role ≥ 2 (i.e. staff).
 */
function requireStaff(req, res, next) {
  if (req.userRole == null || req.userRole < 2) {
    return res.status(403).json({ message: "Forbidden: staff only." });
  }
  next();
}

module.exports = {
  authenticate,
  requireAdmin,
  requireStaff,
};
