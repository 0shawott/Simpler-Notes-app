const prisma = require('../lib/prisma');

// GET /notes — all notes belonging to the logged-in user
async function list(req, res) {
  const notes = await prisma.note.findMany({
    where: { userId: req.user.id },
    orderBy: { updatedAt: 'desc' },
  });

  res.json({ notes });
}

// GET /notes/:id
async function getOne(req, res) {
  const note = await prisma.note.findUnique({ where: { id: req.params.id } });

  // 404 rather than 403 if it belongs to someone else — don't confirm
  // to the caller that a note with this id exists at all.
  if (!note || note.userId !== req.user.id) {
    return res.status(404).json({ error: 'Note not found' });
  }

  res.json({ note });
}

// POST /notes
async function create(req, res) {
  const { title, content } = req.body;

  const note = await prisma.note.create({
    data: {
      title: typeof title === 'string' && title.trim() ? title : 'Untitled',
      content: typeof content === 'string' ? content : '',
      userId: req.user.id,
    },
  });

  res.status(201).json({ note });
}

// PUT /notes/:id
async function update(req, res) {
  const existing = await prisma.note.findUnique({ where: { id: req.params.id } });

  if (!existing || existing.userId !== req.user.id) {
    return res.status(404).json({ error: 'Note not found' });
  }

  const { title, content } = req.body;

  const note = await prisma.note.update({
    where: { id: req.params.id },
    data: {
      ...(typeof title === 'string' ? { title } : {}),
      ...(typeof content === 'string' ? { content } : {}),
    },
  });

  res.json({ note });
}

// DELETE /notes/:id
async function remove(req, res) {
  const existing = await prisma.note.findUnique({ where: { id: req.params.id } });

  if (!existing || existing.userId !== req.user.id) {
    return res.status(404).json({ error: 'Note not found' });
  }

  await prisma.note.delete({ where: { id: req.params.id } });

  res.status(204).send();
}

// POST /notes/bulk — used when a guest logs in/registers and uploads
// their locally-stored (offline) notes to attach to their new account.
// Expects: { notes: [{ title, content }, ...] }
async function bulkCreate(req, res) {
  const { notes } = req.body;

  if (!Array.isArray(notes) || notes.length === 0) {
    return res.status(400).json({ error: '"notes" must be a non-empty array' });
  }

  // $transaction here so this is all-or-nothing, and so we get the
  // created rows back — createMany() doesn't return records in Postgres.
  const created = await prisma.$transaction(
    notes.map((n) =>
      prisma.note.create({
        data: {
          title: typeof n.title === 'string' && n.title.trim() ? n.title : 'Untitled',
          content: typeof n.content === 'string' ? n.content : '',
          userId: req.user.id,
        },
      })
    )
  );

  res.status(201).json({ notes: created });
}

module.exports = { list, getOne, create, update, remove, bulkCreate };