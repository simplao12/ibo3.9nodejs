import { dbService } from '../services/DatabaseService';

/**
 * Insert default data if tables are empty.
 * Port of insertIfEmpty calls from PHP index.php and other pages.
 */
export function runSeed(): void {
  // Default admin user (plain text - will be upgraded to bcrypt on first login)
  dbService.insertIfEmpty('user', { id: 1, username: 'admin', password: 'admin' });

  // Default MAC length
  dbService.insertIfEmpty('macl', { id: 1, mac_length: '12' });

  // Default theme
  dbService.insertIfEmpty('theme', { id: 1, theme_no: 'theme_0' });

  // Default login theme
  dbService.insertIfEmpty('logintheme', { id: 1, themelog: 'theme_0' });

  // Default ads settings
  dbService.insertIfEmpty('adssettings', { id: 1, adstype: '0' });

  // Default welcome messages
  dbService.insertIfEmpty('welcome', { id: 1, message_one: '', message_two: '' });

  // Default app update
  dbService.insertIfEmpty('appupdate', { id: 1, nversion: '3.9', nurl: 'https://t.me/SaNoJRTX' });

  // Default license
  dbService.insertIfEmpty('licens', { id: 1, lkey: '' });

  // Default login text
  dbService.insertIfEmpty('logintext', { id: 1, logintitial: '', loginsubtitial: '' });

  console.log('Database seed complete.');
}
