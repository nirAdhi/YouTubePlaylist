const express = require('express');
const { prisma } = require('../lib/prisma');
const { authMiddleware } = require('./auth');
const { Queue } = require('bullmq');

const router = express.Router();
const reminderQueue = new Queue('reminders', {
  connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' },
});

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const reminders = await prisma.reminder.findMany({
      where: { userId: req.user.userId },
      orderBy: { scheduledTime: 'asc' },
      include: { video: true },
    });
    res.json(reminders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { videoId, scheduledTime } = req.body;
    if (!videoId || !scheduledTime) {
      return res.status(400).json({ error: 'Video ID and scheduled time required' });
    }
    const reminder = await prisma.reminder.create({
      data: {
        userId: req.user.userId,
        videoId,
        scheduledTime: new Date(scheduledTime),
      },
    });

    await reminderQueue.add(
      'send-reminder',
      { reminderId: reminder.id },
      { delay: Math.max(0, new Date(scheduledTime).getTime() - Date.now()) }
    );

    res.json(reminder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create reminder' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.reminder.deleteMany({
      where: { id: req.params.id, userId: req.user.userId },
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete reminder' });
  }
});

module.exports = router;
