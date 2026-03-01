import { Database } from 'sql.js';
import { db } from '../config/database';

type Params = Record<string, unknown>;
type Row = Record<string, unknown>;
type SqlValue = string | number | null;

function asParams(p: Params): Params {
  return p;
}

function parseValue(val: unknown): SqlValue {
  if (val === null || val === undefined) return null;
  if (typeof val === 'string' || typeof val === 'number') return val;
  return String(val);
}

export class DatabaseService {
  private db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  select<T = Row>(
    tableName: string,
    columns = '*',
    where = '',
    orderBy = '',
    placeholders: Params = {}
  ): T[] {
    let query = `SELECT ${columns} FROM ${tableName}`;
    if (where) query += ` WHERE ${where}`;
    if (orderBy) query += ` ORDER BY ${orderBy}`;
    
    const stmt = this.db.prepare(query);
    const params = Object.values(placeholders).map(parseValue);
    stmt.bind(params.length > 0 ? params : undefined);
    
    const results: T[] = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject() as T);
    }
    stmt.free();
    
    return results;
  }

  selectWithCount(
    tableName: string,
    countColumn: string,
    where = '',
    placeholders: Params = {}
  ): { total: number }[] {
    let query = `SELECT COUNT(${countColumn}) AS total FROM ${tableName}`;
    if (where) query += ` WHERE ${where}`;
    
    const stmt = this.db.prepare(query);
    const params = Object.values(placeholders).map(parseValue);
    stmt.bind(params.length > 0 ? params : undefined);
    
    const results: { total: number }[] = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject() as { total: number });
    }
    stmt.free();
    
    return results;
  }

  selectPaged<T = Row>(
    tableName: string,
    columns = '*',
    where = '',
    placeholders: Params = {},
    limit = 30,
    offset = 0
  ): T[] {
    let query = `SELECT ${columns} FROM ${tableName}`;
    if (where) query += ` WHERE ${where}`;
    query += ` ORDER BY id ASC LIMIT ? OFFSET ?`;
    
    const stmt = this.db.prepare(query);
    const params = [...Object.values(placeholders).map(parseValue), limit, offset];
    stmt.bind(params);
    
    const results: T[] = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject() as T);
    }
    stmt.free();
    
    return results;
  }

  insert(tableName: string, data: Params): number {
    const keys = Object.keys(data);
    const cols = keys.join(', ');
    const placeholders = keys.map(() => '?').join(', ');
    const values = keys.map((k) => parseValue(data[k]));
    const sql = `INSERT INTO ${tableName} (${cols}) VALUES (${placeholders})`;
    
    const stmt = this.db.prepare(sql);
    stmt.bind(values);
    stmt.step();
    stmt.free();
    
    // Get last insert rowid
    const result = this.db.exec('SELECT last_insert_rowid() as id');
    return (result[0]?.values[0]?.[0] as number) ?? 0;
  }

  update(tableName: string, data: Params, where = '', placeholders: Params = {}): number {
    const keys = Object.keys(data);
    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    let query = `UPDATE ${tableName} SET ${setClause}`;
    if (where) query += ` WHERE ${where}`;
    
    const values = [...keys.map((k) => parseValue(data[k])), ...Object.values(placeholders).map(parseValue)];
    
    const stmt = this.db.prepare(query);
    stmt.bind(values);
    stmt.step();
    stmt.free();
    
    // Get changes count
    const result = this.db.exec('SELECT changes() as count');
    return (result[0]?.values[0]?.[0] as number) ?? 0;
  }

  delete(tableName: string, where = '', placeholders: Params = {}): number {
    let query = `DELETE FROM ${tableName}`;
    if (where) query += ` WHERE ${where}`;
    
    const stmt = this.db.prepare(query);
    const params = Object.values(placeholders).map(parseValue);
    stmt.bind(params.length > 0 ? params : undefined);
    stmt.step();
    stmt.free();
    
    // Get changes count
    const result = this.db.exec('SELECT changes() as count');
    return (result[0]?.values[0]?.[0] as number) ?? 0;
  }

  insertIfEmpty(tableName: string, data: Params): boolean {
    const row = this.selectWithCount(tableName, '*')[0];
    if (row && row.total === 0) {
      this.insert(tableName, data);
      return true;
    }
    return false;
  }

  findDuplicates(tableName: string, column: string): string[] {
    const rows = this.select<Row>(
      tableName,
      column,
      '',
      '',
      {}
    );
    const counts: Record<string, number> = {};
    rows.forEach((r) => {
      const val = String(r[column]);
      counts[val] = (counts[val] ?? 0) + 1;
    });
    return Object.keys(counts).filter((k) => counts[k] > 1);
  }

  getOne<T = Row>(tableName: string, where: string, placeholders: Params = {}): T | undefined {
    const query = `SELECT * FROM ${tableName} WHERE ${where} LIMIT 1`;
    
    const stmt = this.db.prepare(query);
    const params = Object.values(placeholders).map(parseValue);
    stmt.bind(params.length > 0 ? params : undefined);
    
    let result: T | undefined;
    if (stmt.step()) {
      result = stmt.getAsObject() as T;
    }
    stmt.free();
    
    return result;
  }

  raw(sql: string, params: Params = {}): unknown {
    const stmt = this.db.prepare(sql);
    const values = Object.values(params).map(parseValue);
    stmt.bind(values.length > 0 ? values : undefined);
    
    const results: Row[] = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject() as Row);
    }
    stmt.free();
    
    return results;
  }
}

export const dbService = new DatabaseService(db);
