import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { env } from './env';

let dbInstance: Database | undefined;

const dbPath = path.isAbsolute(env.DATABASE_PATH)
  ? env.DATABASE_PATH
  : path.join(process.cwd(), env.DATABASE_PATH);

export async function initDatabase(): Promise<Database> {
  const SQL = await initSqlJs();
  
  try {
    // Try to load existing database
    const fileBuffer = fs.readFileSync(dbPath);
    dbInstance = new SQL.Database(fileBuffer);
  } catch {
    // Create new database if file doesn't exist
    dbInstance = new SQL.Database();
  }

  // Performance pragmas
  dbInstance.run('PRAGMA journal_mode = WAL');
  dbInstance.run('PRAGMA synchronous = NORMAL');
  dbInstance.run('PRAGMA foreign_keys = ON');

  return dbInstance;
}

function saveDatabase() {
  if (dbInstance) {
    const data = dbInstance.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
  }
}

// Save database on process exit
process.on('exit', saveDatabase);
process.on('SIGINT', () => {
  saveDatabase();
  process.exit(0);
});

// Getter functions
export function getDb(): Database {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return dbInstance;
}

export function isDbReady(): boolean {
  return dbInstance !== undefined;
}
