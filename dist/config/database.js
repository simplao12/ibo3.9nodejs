"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = initDatabase;
exports.getDb = getDb;
exports.isDbReady = isDbReady;
const sql_js_1 = __importDefault(require("sql.js"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./env");
let dbInstance;
const dbPath = path_1.default.isAbsolute(env_1.env.DATABASE_PATH)
    ? env_1.env.DATABASE_PATH
    : path_1.default.join(process.cwd(), env_1.env.DATABASE_PATH);
async function initDatabase() {
    const SQL = await (0, sql_js_1.default)();
    try {
        // Try to load existing database
        const fileBuffer = fs_1.default.readFileSync(dbPath);
        dbInstance = new SQL.Database(fileBuffer);
    }
    catch {
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
        fs_1.default.writeFileSync(dbPath, Buffer.from(data));
    }
}
// Save database on process exit
process.on('exit', saveDatabase);
process.on('SIGINT', () => {
    saveDatabase();
    process.exit(0);
});
// Getter functions
function getDb() {
    if (!dbInstance) {
        throw new Error('Database not initialized. Call initDatabase() first.');
    }
    return dbInstance;
}
function isDbReady() {
    return dbInstance !== undefined;
}
//# sourceMappingURL=database.js.map