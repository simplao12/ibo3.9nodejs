import { DatabaseSync } from 'node:sqlite';
import { db } from '../config/database';

// Broad external type for convenience; cast to SqlValue internally
type SqlValue = string | number | bigint | null | Uint8Array;
type Params = Record<string, unknown>;
type SqlParams = Record<string, SqlValue>;
type Row = Record<string, unknown>;

function asParams(p: Params): SqlParams {
  return p as SqlParams;
}

export class DatabaseService {
  private db: DatabaseSync;

  constructor(database: DatabaseSync) {
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
    return (Object.keys(placeholders).length
      ? stmt.all(asParams(placeholders))
      : stmt.all()) as T[];
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
    return (Object.keys(placeholders).length
      ? stmt.all(asParams(placeholders))
      : stmt.all()) as { total: number }[];
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
    query += ` ORDER BY id ASC LIMIT $limit OFFSET $offset`;
    const merged = { ...asParams(placeholders), $limit: limit, $offset: offset };
    return this.db.prepare(query).all(merged) as T[];
  }

  insert(tableName: string, data: Params): number {
    const keys = Object.keys(data);
    const cols = keys.join(', ');
    const vals = keys.map((k) => `$${k}`).join(', ');
    const params: SqlParams = {};
    keys.forEach((k) => { params[`$${k}`] = data[k] as SqlValue; });
    const result = this.db
      .prepare(`INSERT INTO ${tableName} (${cols}) VALUES (${vals})`)
      .run(params);
    return result.lastInsertRowid as number;
  }

  update(tableName: string, data: Params, where = '', placeholders: Params = {}): number {
    const setClause = Object.keys(data).map((k) => `${k} = $${k}`).join(', ');
    let query = `UPDATE ${tableName} SET ${setClause}`;
    if (where) query += ` WHERE ${where}`;
    const dataParams: SqlParams = {};
    Object.keys(data).forEach((k) => { dataParams[`$${k}`] = data[k] as SqlValue; });
    const result = this.db.prepare(query).run({ ...dataParams, ...asParams(placeholders) });
    return result.changes as number;
  }

  delete(tableName: string, where = '', placeholders: Params = {}): number {
    let query = `DELETE FROM ${tableName}`;
    if (where) query += ` WHERE ${where}`;
    const stmt = this.db.prepare(query);
    const result = Object.keys(placeholders).length
      ? stmt.run(asParams(placeholders))
      : stmt.run();
    return result.changes as number;
  }

  insertIfEmpty(tableName: string, data: Params): boolean {
    const row = this.db
      .prepare(`SELECT COUNT(*) AS c FROM ${tableName}`)
      .get() as { c: number };
    if (row.c === 0) {
      this.insert(tableName, data);
      return true;
    }
    return false;
  }

  findDuplicates(tableName: string, column: string): string[] {
    const rows = this.db
      .prepare(`SELECT ${column} FROM ${tableName} GROUP BY ${column} HAVING COUNT(*) > 1`)
      .all() as Row[];
    return rows.map((r) => String(r[column]));
  }

  getOne<T = Row>(tableName: string, where: string, placeholders: Params = {}): T | undefined {
    const query = `SELECT * FROM ${tableName} WHERE ${where} LIMIT 1`;
    const stmt = this.db.prepare(query);
    return (Object.keys(placeholders).length
      ? stmt.get(asParams(placeholders))
      : stmt.get()) as T | undefined;
  }

  raw(sql: string, params: Params = {}): unknown {
    const stmt = this.db.prepare(sql);
    return Object.keys(params).length ? stmt.all(asParams(params)) : stmt.all();
  }
}

export const dbService = new DatabaseService(db);
