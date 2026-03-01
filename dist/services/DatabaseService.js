"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbService = exports.DatabaseService = void 0;
const database_1 = require("../config/database");
function asParams(p) {
    return p;
}
function parseValue(val) {
    if (val === null || val === undefined)
        return null;
    if (typeof val === 'string' || typeof val === 'number')
        return val;
    return String(val);
}
class DatabaseService {
    constructor(database) {
        this.db = database;
    }
    select(tableName, columns = '*', where = '', orderBy = '', placeholders = {}) {
        let query = `SELECT ${columns} FROM ${tableName}`;
        if (where)
            query += ` WHERE ${where}`;
        if (orderBy)
            query += ` ORDER BY ${orderBy}`;
        const stmt = this.db.prepare(query);
        const params = Object.values(placeholders).map(parseValue);
        stmt.bind(params.length > 0 ? params : undefined);
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    }
    selectWithCount(tableName, countColumn, where = '', placeholders = {}) {
        let query = `SELECT COUNT(${countColumn}) AS total FROM ${tableName}`;
        if (where)
            query += ` WHERE ${where}`;
        const stmt = this.db.prepare(query);
        const params = Object.values(placeholders).map(parseValue);
        stmt.bind(params.length > 0 ? params : undefined);
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    }
    selectPaged(tableName, columns = '*', where = '', placeholders = {}, limit = 30, offset = 0) {
        let query = `SELECT ${columns} FROM ${tableName}`;
        if (where)
            query += ` WHERE ${where}`;
        query += ` ORDER BY id ASC LIMIT ? OFFSET ?`;
        const stmt = this.db.prepare(query);
        const params = [...Object.values(placeholders).map(parseValue), limit, offset];
        stmt.bind(params);
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    }
    insert(tableName, data) {
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
        return result[0]?.values[0]?.[0] ?? 0;
    }
    update(tableName, data, where = '', placeholders = {}) {
        const keys = Object.keys(data);
        const setClause = keys.map((k) => `${k} = ?`).join(', ');
        let query = `UPDATE ${tableName} SET ${setClause}`;
        if (where)
            query += ` WHERE ${where}`;
        const values = [...keys.map((k) => parseValue(data[k])), ...Object.values(placeholders).map(parseValue)];
        const stmt = this.db.prepare(query);
        stmt.bind(values);
        stmt.step();
        stmt.free();
        // Get changes count
        const result = this.db.exec('SELECT changes() as count');
        return result[0]?.values[0]?.[0] ?? 0;
    }
    delete(tableName, where = '', placeholders = {}) {
        let query = `DELETE FROM ${tableName}`;
        if (where)
            query += ` WHERE ${where}`;
        const stmt = this.db.prepare(query);
        const params = Object.values(placeholders).map(parseValue);
        stmt.bind(params.length > 0 ? params : undefined);
        stmt.step();
        stmt.free();
        // Get changes count
        const result = this.db.exec('SELECT changes() as count');
        return result[0]?.values[0]?.[0] ?? 0;
    }
    insertIfEmpty(tableName, data) {
        const row = this.selectWithCount(tableName, '*')[0];
        if (row && row.total === 0) {
            this.insert(tableName, data);
            return true;
        }
        return false;
    }
    findDuplicates(tableName, column) {
        const rows = this.select(tableName, column, '', '', {});
        const counts = {};
        rows.forEach((r) => {
            const val = String(r[column]);
            counts[val] = (counts[val] ?? 0) + 1;
        });
        return Object.keys(counts).filter((k) => counts[k] > 1);
    }
    getOne(tableName, where, placeholders = {}) {
        const query = `SELECT * FROM ${tableName} WHERE ${where} LIMIT 1`;
        const stmt = this.db.prepare(query);
        const params = Object.values(placeholders).map(parseValue);
        stmt.bind(params.length > 0 ? params : undefined);
        let result;
        if (stmt.step()) {
            result = stmt.getAsObject();
        }
        stmt.free();
        return result;
    }
    raw(sql, params = {}) {
        const stmt = this.db.prepare(sql);
        const values = Object.values(params).map(parseValue);
        stmt.bind(values.length > 0 ? values : undefined);
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    }
}
exports.DatabaseService = DatabaseService;
exports.dbService = new DatabaseService(database_1.db);
//# sourceMappingURL=DatabaseService.js.map