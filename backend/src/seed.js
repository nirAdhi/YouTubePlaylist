const bcrypt = require('bcrypt');
const { prisma } = require('./lib/prisma');

const SALT_ROUNDS = 12;

async function seed() {
  const email = process.argv[2] || 'admin@vidvault.local';
  const password = process.argv[3];

  if (!password) {
    console.error('Password is required: npm run seed <email> <password>');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Password must be at least 8 characters');
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`User ${email} already exists`);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  console.log(`Created user: ${user.email} (id: ${user.id})`);
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
