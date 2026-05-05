const express = require('express');
const { prisma } = require('../lib/prisma');
const { authMiddleware } = require('./auth');
const { fetchYouTubeMetadata } = require('../services/youtube');
const { categorizeVideo } = require('../services/categorize');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { category, search, status } = req.query;
    const where = { userId: req.user.userId };
    if (category) where.category = category;
    if (status) where.watchStatus = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { channel: { contains: search, mode: 'insensitive' } },
      ];
    }
    const videos = await prisma.video.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { playlists: { include: { playlist: true } } },
    });
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { url, note } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const metadata = await fetchYouTubeMetadata(url);
    const category = categorizeVideo(metadata.title, metadata.channel);

    const video = await prisma.video.create({
      data: {
        userId: req.user.userId,
        url,
        title: metadata.title,
        thumbnail: metadata.thumbnail,
        channel: metadata.channel,
        duration: metadata.duration,
        category,
        note: note || null,
      },
    });

    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add video' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const video = await prisma.video.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
      include: { playlists: { include: { playlist: true } } },
    });
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { watchStatus, timestamp, note, category } = req.body;
    const data = {};
    if (watchStatus !== undefined) data.watchStatus = watchStatus;
    if (timestamp !== undefined) data.timestamp = timestamp;
    if (note !== undefined) data.note = note;
    if (category !== undefined) data.category = category;

    const video = await prisma.video.updateMany({
      where: { id: req.params.id, userId: req.user.userId },
      data,
    });
    if (video.count === 0) return res.status(404).json({ error: 'Video not found' });
    const updated = await prisma.video.findUnique({ where: { id: req.params.id } });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update video' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.video.deleteMany({
      where: { id: req.params.id, userId: req.user.userId },
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

module.exports = router;
