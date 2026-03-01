import { runMigrations } from './db/migrate';
import { runSeed } from './db/seed';
import { env } from './config/env';
import { initDatabase } from './config/database';
import app from './app';

// Run DB setup before starting server
async function start() {
  await initDatabase();
  runMigrations();
  runSeed();

  app.listen(env.PORT, () => {
    console.log(`IBO Panel running at http://localhost:${env.PORT}`);
    console.log(`Environment: ${env.NODE_ENV}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
