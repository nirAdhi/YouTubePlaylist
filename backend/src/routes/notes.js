const express = require('express');
const { prisma } = require('../lib/prisma');
const { authMiddleware } = require('./auth');

const router = express.Router();

// All note routes require authentication
router.use(authMiddleware);

// Get all notes for the user
router.get('/', async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.user.userId },
      orderBy: [
        { isPinned: 'desc' },
        { updatedAt: 'desc' },
      ],
    });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Get a single note
router.get('/:id', async (req, res) => {
  try {
    const note = await prisma.note.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// Create a new note
router.post('/', async (req, res) => {
  try {
    const { title, content, color, category, isPinned } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const note = await prisma.note.create({
      data: {
        userId: req.user.userId,
        title,
        content,
        color: color || 'gray',
        category: category || 'General',
        isPinned: isPinned || false,
      },
    });
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update a note
router.patch('/:id', async (req, res) => {
  try {
    const { title, content, color, category, isPinned } = req.body;
    
    const existing = await prisma.note.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const note = await prisma.note.update({
      where: { id: req.params.id },
      data: {
        title: title ?? existing.title,
        content: content ?? existing.content,
        color: color ?? existing.color,
        category: category ?? existing.category,
        isPinned: isPinned ?? existing.isPinned,
      },
    });
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const existing = await prisma.note.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await prisma.note.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Toggle pin status
router.patch('/:id/pin', async (req, res) => {
  try {
    const existing = await prisma.note.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const note = await prisma.note.update({
      where: { id: req.params.id },
      data: { isPinned: !existing.isPinned },
    });
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to toggle pin' });
  }
});

module.exports = router;
