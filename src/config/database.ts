import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { env } from './env';

let db: Database;

const dbPath = path.isAbsolute(env.DATABASE_PATH)
  ? env.DATABASE_PATH
  : path.join(process.cwd(), env.DATABASE_PATH);

export async function initDatabase(): Promise<Database> {
  const SQL = await initSqlJs();
  
  try {
    // Try to load existing database
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } catch {
    // Create new database if file doesn't exist
    db = new SQL.Database();
  }

  // Performance pragmas
  db.run('PRAGMA journal_mode = WAL');
  db.run('PRAGMA synchronous = NORMAL');
  db.run('PRAGMA foreign_keys = ON');

  return db;
}

function saveDatabase() {
  if (db) {
    const data = db.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
  }
}

// Save database on process exit
process.on('exit', saveDatabase);
process.on('SIGINT', () => {
  saveDatabase();
  process.exit(0);
});

// Wrapper to provide familiar interface
class DatabaseWrapper {
  private db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  prepare(sql: string) {
    return this.db.prepare(sql);
  }

  run(sql: string, params?: any[]): void {
    this.db.run(sql, params);
  }

  exec(sql: string): any {
    return this.db.exec(sql);
  }

  export(): Uint8Array {
    return this.db.export();
  }
}

export { db };
export { Database };
