const { PrismaClient } = require('@prisma/client');

// A single shared instance is reused across the app instead of creating
// a new PrismaClient in every file — avoids exhausting DB connections,
// especially important with nodemon's hot-reloading in dev.
const prisma = new PrismaClient();

module.exports = prisma;