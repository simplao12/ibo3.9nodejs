import Database, { type Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import { env } from './env';

const dbPath = path.isAbsolute(env.DATABASE_PATH)
  ? env.DATABASE_PATH
  : path.join(process.cwd(), env.DATABASE_PATH);

export const db: DatabaseType = new Database(dbPath);

// Performance pragmas
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA synchronous = NORMAL');
db.exec('PRAGMA foreign_keys = ON');
