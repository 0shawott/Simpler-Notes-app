const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const notesController = require('../controllers/notes.controller');

const router = express.Router();

// Every route here requires a logged-in user — guests never reach the DB.
router.use(requireAuth);

router.get('/', asyncHandler(notesController.list));
router.post('/bulk', asyncHandler(notesController.bulkCreate));
router.get('/:id', asyncHandler(notesController.getOne));
router.post('/', asyncHandler(notesController.create));
router.put('/:id', asyncHandler(notesController.update));
router.delete('/:id', asyncHandler(notesController.remove));

module.exports = router;