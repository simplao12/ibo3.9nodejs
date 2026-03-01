import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { env } from './env';

const dbPath = path.isAbsolute(env.DATABASE_PATH)
  ? env.DATABASE_PATH
  : path.join(process.cwd(), env.DATABASE_PATH);

export const db = new DatabaseSync(dbPath);

// Performance pragmas
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA synchronous = NORMAL');
db.exec('PRAGMA foreign_keys = ON');
