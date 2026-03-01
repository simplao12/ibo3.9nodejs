"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSeed = runSeed;
const DatabaseService_1 = require("../services/DatabaseService");
/**
 * Insert default data if tables are empty.
 * Port of insertIfEmpty calls from PHP index.php and other pages.
 */
function runSeed() {
    // Default admin user (plain text - will be upgraded to bcrypt on first login)
    DatabaseService_1.dbService.insertIfEmpty('user', { id: 1, username: 'admin', password: 'admin' });
    // Default MAC length
    DatabaseService_1.dbService.insertIfEmpty('macl', { id: 1, mac_length: '12' });
    // Default theme
    DatabaseService_1.dbService.insertIfEmpty('theme', { id: 1, theme_no: 'theme_0' });
    // Default login theme
    DatabaseService_1.dbService.insertIfEmpty('logintheme', { id: 1, themelog: 'theme_0' });
    // Default ads settings
    DatabaseService_1.dbService.insertIfEmpty('adssettings', { id: 1, adstype: '0' });
    // Default welcome messages
    DatabaseService_1.dbService.insertIfEmpty('welcome', { id: 1, message_one: '', message_two: '' });
    // Default app update
    DatabaseService_1.dbService.insertIfEmpty('appupdate', { id: 1, nversion: '3.9', nurl: 'https://t.me/SaNoJRTX' });
    // Default license
    DatabaseService_1.dbService.insertIfEmpty('licens', { id: 1, lkey: '' });
    // Default login text
    DatabaseService_1.dbService.insertIfEmpty('logintext', { id: 1, logintitial: '', loginsubtitial: '' });
    console.log('Database seed complete.');
}
//# sourceMappingURL=seed.js.map