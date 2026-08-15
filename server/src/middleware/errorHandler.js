// Catches errors passed via next(err) from anywhere in the app,
// including async route handlers wrapped with asyncHandler (see utils).
// Keeping this centralized means individual routes/controllers don't
// need their own try/catch + res.status(...) boilerplate everywhere.
function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message = status === 500 ? 'Internal server error' : err.message;

  res.status(status).json({ error: message });
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Not found' });
}

module.exports = { errorHandler, notFoundHandler };