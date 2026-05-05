const express = require('express');
const { prisma } = require('../lib/prisma');
const { authMiddleware } = require('./auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const playlists = await prisma.playlist.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      include: { videos: { include: { video: true } } },
    });
    res.json(playlists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const playlist = await prisma.playlist.create({
      data: { userId: req.user.userId, name },
    });
    res.json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

router.post('/:id/videos', async (req, res) => {
  try {
    const { videoId } = req.body;
    const playlist = await prisma.playlist.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    });
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

    const pv = await prisma.playlistVideo.create({
      data: { playlistId: req.params.id, videoId },
    });
    res.json(pv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add video to playlist' });
  }
});

router.delete('/:id/videos/:videoId', async (req, res) => {
  try {
    await prisma.playlistVideo.deleteMany({
      where: { playlistId: req.params.id, videoId: req.params.videoId },
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove video from playlist' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.playlist.deleteMany({
      where: { id: req.params.id, userId: req.user.userId },
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete playlist' });
  }
});

module.exports = router;
