const { port } = require('./config/env');
const app = require('./app');
const prisma = require('./lib/prisma');

const server = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

// Graceful shutdown — closes the Prisma connection pool cleanly instead
// of leaving dangling DB connections when the process is killed.
async function shutdown() {
  console.log('Shutting down...');
  await prisma.$disconnect();
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);