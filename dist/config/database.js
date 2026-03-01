"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.initDatabase = initDatabase;
const sql_js_1 = __importDefault(require("sql.js"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./env");
let db;
const dbPath = path_1.default.isAbsolute(env_1.env.DATABASE_PATH)
    ? env_1.env.DATABASE_PATH
    : path_1.default.join(process.cwd(), env_1.env.DATABASE_PATH);
async function initDatabase() {
    const SQL = await (0, sql_js_1.default)();
    try {
        // Try to load existing database
        const fileBuffer = fs_1.default.readFileSync(dbPath);
        exports.db = db = new SQL.Database(fileBuffer);
    }
    catch {
        // Create new database if file doesn't exist
        exports.db = db = new SQL.Database();
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
        fs_1.default.writeFileSync(dbPath, Buffer.from(data));
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
    constructor(database) {
        this.db = database;
    }
    prepare(sql) {
        return this.db.prepare(sql);
    }
    run(sql, params) {
        this.db.run(sql, params);
    }
    exec(sql) {
        return this.db.exec(sql);
    }
    export() {
        return this.db.export();
    }
}
//# sourceMappingURL=database.js.map