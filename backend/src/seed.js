const { prisma } = require('./lib/prisma');

async function seed() {
  const email = process.argv[2] || 'admin@vidvault.local';
  const password = process.argv[3] || 'admin123';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`User ${email} already exists`);
    process.exit(0);
  }

  const user = await prisma.user.create({
    data: { email, password },
  });

  console.log(`Created user: ${user.email} (id: ${user.id})`);
  console.log(`Password: ${password}`);
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
