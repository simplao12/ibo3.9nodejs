import { runMigrations } from './db/migrate';
import { runSeed } from './db/seed';
import { env } from './config/env';
import app from './app';

// Run DB setup before starting server
runMigrations();
runSeed();

app.listen(env.PORT, () => {
  console.log(`IBO Panel running at http://localhost:${env.PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});
