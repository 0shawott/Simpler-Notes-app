const { verifyToken } = require('../utils/jwt');

// Requires a valid JWT — used on routes that only logged-in users can hit
// (e.g. saving notes to the DB). Rejects with 401 if missing/invalid.
function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = header.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.userId };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Doesn't reject if there's no token — just attaches req.user if a valid
// one is present. Useful later for routes that behave differently for
// guests vs logged-in users without hard-requiring auth.
function optionalAuth(req, res, next) {
  const header = req.headers.authorization;

  if (header && header.startsWith('Bearer ')) {
    const token = header.split(' ')[1];
    try {
      const payload = verifyToken(token);
      req.user = { id: payload.userId };
    } catch (err) {
      // invalid token on an optional route — just treat as a guest
    }
  }

  next();
}

module.exports = { requireAuth, optionalAuth };