"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const migrate_1 = require("./db/migrate");
const seed_1 = require("./db/seed");
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const app_1 = __importDefault(require("./app"));
// Run DB setup before starting server
async function start() {
    await (0, database_1.initDatabase)();
    (0, migrate_1.runMigrations)();
    (0, seed_1.runSeed)();
    app_1.default.listen(env_1.env.PORT, () => {
        console.log(`IBO Panel running at http://localhost:${env_1.env.PORT}`);
        console.log(`Environment: ${env_1.env.NODE_ENV}`);
    });
}
start().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map