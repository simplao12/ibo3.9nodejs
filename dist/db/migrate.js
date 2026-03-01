"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = runMigrations;
const database_1 = require("../config/database");
/**
 * Creates all tables if they don't exist.
 * Port of PHP createTables() from includes/functions.php + table.php schema
 */
function runMigrations() {
    const migrations = [
        `CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    )`,
        `CREATE TABLE IF NOT EXISTS dns (
      id INTEGER PRIMARY KEY,
      title TEXT,
      url TEXT
    )`,
        `CREATE TABLE IF NOT EXISTS ibo (
      id INTEGER PRIMARY KEY NOT NULL,
      mac_address TEXT,
      username TEXT,
      password TEXT,
      protection TEXT,
      url TEXT,
      title TEXT
    )`,
        `CREATE TABLE IF NOT EXISTS ibocode (
      id INTEGER PRIMARY KEY NOT NULL,
      ac_code TEXT,
      username TEXT,
      password TEXT,
      status TEXT,
      url TEXT
    )`,
        `CREATE TABLE IF NOT EXISTS sports (
      id INTEGER PRIMARY KEY,
      header_n TEXT,
      border_c TEXT,
      background_c TEXT,
      text_c TEXT,
      days TEXT,
      api TEXT
    )`,
        `CREATE TABLE IF NOT EXISTS welcome (
      id INTEGER PRIMARY KEY,
      message_one TEXT,
      message_two TEXT
    )`,
        `CREATE TABLE IF NOT EXISTS macl (
      id INTEGER PRIMARY KEY,
      mac_length TEXT
    )`,
        `CREATE TABLE IF NOT EXISTS theme (
      id INTEGER PRIMARY KEY,
      theme_no TEXT
    )`,
        `CREATE TABLE IF NOT EXISTS trial (
      id INTEGER PRIMARY KEY,
      mac_address TEXT,
      expire_date TEXT
    )`,
        `CREATE TABLE IF NOT EXISTS perant (
      id INTEGER PRIMARY KEY,
      mac_address TEXT,
      password TEXT
    )`,
        `CREATE TABLE IF NOT EXISTS adssettings (
      id INTEGER PRIMARY KEY,
      adstype TEXT
    )`,
        `CREATE TABLE IF NOT EXISTS autolayout (
      id INTEGER PRIMARY KEY,
      layout TEXT
    )`,
        `CREATE TABLE IF NOT EXISTS framelayout (
      id INTEGER PRIMARY KEY,
      layout TEXT
    )`,
        `CREATE TABLE IF NOT EXISTS menuads (
      id INTEGER PRIMARY KEY,
      title TEXT,
      url TEXT
    )`,
        `CREATE TABLE IF NOT EXISTS appupdate (
      id INTEGER PRIMARY KEY,
      nversion TEXT,
      nurl TEXT
    )`,
        `CREATE TABLE IF NOT EXISTS licens (
      id INTEGER PRIMARY KEY,
      lkey TEXT
    )`,
        `CREATE TABLE IF NOT EXISTS leaguesx (
      id INTEGER PRIMARY KEY,
      league TEXT,
      leagueId TEXT
    )`,
        `CREATE TABLE IF NOT EXISTS leaguestable (
      id INTEGER PRIMARY KEY,
      league TEXT,
      leagueId TEXT
    )`,
        `CREATE TABLE IF NOT EXISTS demopls (
      id INTEGER PRIMARY KEY,
      mplname TEXT,
      mdns TEXT,
      muser TEXT,
      mpass TEXT
    )`,
        `CREATE TABLE IF NOT EXISTS logintheme (
      id INTEGER PRIMARY KEY,
      themelog TEXT
    )`,
        `CREATE TABLE IF NOT EXISTS logintext (
      id INTEGER PRIMARY KEY,
      logintitial TEXT,
      loginsubtitial TEXT
    )`,
        // Legacy table from api/index.php
        `CREATE TABLE IF NOT EXISTS menualuser (
      id INTEGER PRIMARY KEY,
      title TEXT,
      username TEXT,
      password TEXT,
      expire_date TEXT
    )`,
    ];
    database_1.db.exec('BEGIN');
    try {
        for (const sql of migrations) {
            database_1.db.exec(sql);
        }
        database_1.db.exec('COMMIT');
    }
    catch (err) {
        database_1.db.exec('ROLLBACK');
        throw err;
    }
    console.log('Database migrations complete.');
}
//# sourceMappingURL=migrate.js.map