const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

// Payload kept minimal on purpose — just enough to identify the user.
// Anything else needed (email, etc.) should be fetched fresh from the DB,
// not trusted from the token, in case it goes stale.
function signToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, jwtSecret);
}

module.exports = { signToken, verifyToken };