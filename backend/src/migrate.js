const { execSync } = require('child_process');

try {
  console.log('Running Prisma migrate deploy...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('Migration complete');
} catch (e) {
  console.error('No migrations found, using db push instead...');
  try {
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
    console.log('Database sync complete');
  } catch (e2) {
    console.error('Database setup failed');
    process.exit(1);
  }
}
