const express = require('express');
const cors = require('cors');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Simple health check — useful for confirming the server + env loaded
// correctly before wiring up DB-dependent routes.
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Route mount points — added as each resource is built.

app.use('/auth', require('./routes/auth.routes'));
// app.use('/notes', require('./routes/notes.routes'));

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;