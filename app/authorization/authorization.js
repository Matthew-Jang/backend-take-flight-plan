// app/authorization/authorization.js
const db = require("../models");
const Session = db.session;

async function authenticate(req, res, next) {
  console.log("authenticate");

  // 1. Check for Authorization header
  const authHeader = req.get("authorization");
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized! No Auth Header" });
  }

  // 2. Validate format: "Bearer <token>"
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).send({ message: "Unauthorized! Invalid Auth Header" });
  }

  try {
    // 3. Look up the session
    const session = await Session.findOne({ where: { token } });
    if (!session) {
      return res.status(401).send({ message: "Unauthorized! Invalid token" });
    }

    // 4. Check expiration
    const expiry = new Date(session.expirationDate).getTime();
    if (expiry < Date.now()) {
      return res
        .status(401)
        .send({ message: "Unauthorized! Expired Token, logout and login again" });
    }

    // 5. All good—attach anything you need and call next()
    req.userId = session.userId; // if you need it later
    next();

  } catch (err) {
    console.error("Authentication error:", err);
    res.status(500).send({ message: "Internal server error." });
  }
}

module.exports = { authenticate };
