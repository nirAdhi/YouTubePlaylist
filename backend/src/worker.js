const { Worker } = require('bullmq');
const { prisma } = require('./lib/prisma');

const worker = new Worker(
  'reminders',
  async (job) => {
    if (job.name === 'send-reminder') {
      const { reminderId } = job.data;
      const reminder = await prisma.reminder.findUnique({
        where: { id: reminderId },
        include: { video: true, user: true },
      });
      if (reminder && reminder.status === 'pending') {
        console.log(`Reminder triggered: ${reminder.user.email} should watch "${reminder.video.title}"`);
        await prisma.reminder.update({
          where: { id: reminderId },
          data: { status: 'sent' },
        });
      }
    }
  },
  {
    connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' },
  }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

console.log('VidVault worker started');
