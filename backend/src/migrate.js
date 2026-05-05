const fs = require('fs');
const { execSync } = require('child_process');

const migrationsDir = './prisma/migrations';
const hasMigrations = fs.existsSync(migrationsDir) && fs.readdirSync(migrationsDir).some(f => f.endsWith('.sql'));

try {
  if (hasMigrations) {
    console.log('Running Prisma migrate deploy...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('Migration complete');
  } else {
    console.log('No migrations found, using db push instead...');
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
    console.log('Database sync complete');
  }
} catch (e) {
  console.error('Database setup failed');
  process.exit(1);
}
