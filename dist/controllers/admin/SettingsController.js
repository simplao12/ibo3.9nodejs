"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const DatabaseService_1 = require("../../services/DatabaseService");
class SettingsController {
    // Notification (welcome messages)
    showNotification(req, res) {
        const row = DatabaseService_1.dbService.getOne('welcome', 'id = 1');
        res.render('settings/notification', { title: 'Set Notification', row: row || { message_one: '', message_two: '' }, flash: res.locals.flash });
    }
    updateNotification(req, res) {
        const { message_one, message_two } = req.body;
        const existing = DatabaseService_1.dbService.getOne('welcome', 'id = 1');
        if (existing) {
            DatabaseService_1.dbService.update('welcome', { message_one, message_two }, 'id = 1');
        }
        else {
            DatabaseService_1.dbService.insert('welcome', { id: 1, message_one, message_two });
        }
        res.flash('success', 'Notification messages updated.');
        res.redirect('/settings/notification');
    }
    // MAC Address Length
    showMacLength(req, res) {
        const row = DatabaseService_1.dbService.getOne('macl', 'id = 1');
        res.render('settings/mac-length', { title: 'Set MAC Length', row: row || { mac_length: '12' }, flash: res.locals.flash });
    }
    updateMacLength(req, res) {
        const { mac_length } = req.body;
        const existing = DatabaseService_1.dbService.getOne('macl', 'id = 1');
        if (existing) {
            DatabaseService_1.dbService.update('macl', { mac_length }, 'id = 1');
        }
        else {
            DatabaseService_1.dbService.insert('macl', { id: 1, mac_length });
        }
        res.flash('success', 'MAC address length updated.');
        res.redirect('/settings/mac-length');
    }
    // Demo Playlist
    showDemo(req, res) {
        const row = DatabaseService_1.dbService.getOne('demopls', 'id = 1');
        res.render('settings/demo', { title: 'Demo Playlist', row: row || { mplname: '', mdns: '', muser: '', mpass: '' }, flash: res.locals.flash });
    }
    updateDemo(req, res) {
        const { mplname, mdns, muser, mpass } = req.body;
        const existing = DatabaseService_1.dbService.getOne('demopls', 'id = 1');
        if (existing) {
            DatabaseService_1.dbService.update('demopls', { mplname, mdns, muser, mpass }, 'id = 1');
        }
        else {
            DatabaseService_1.dbService.insert('demopls', { id: 1, mplname, mdns, muser, mpass });
        }
        res.flash('success', 'Demo playlist updated.');
        res.redirect('/settings/demo');
    }
    // App Update
    showUpdate(req, res) {
        const row = DatabaseService_1.dbService.getOne('appupdate', 'id = 1');
        res.render('settings/update', { title: 'Remote Update', row: row || { nversion: '3.9', nurl: '' }, flash: res.locals.flash });
    }
    updateUpdate(req, res) {
        const { nversion, nurl } = req.body;
        const existing = DatabaseService_1.dbService.getOne('appupdate', 'id = 1');
        if (existing) {
            DatabaseService_1.dbService.update('appupdate', { nversion, nurl }, 'id = 1');
        }
        else {
            DatabaseService_1.dbService.insert('appupdate', { id: 1, nversion, nurl });
        }
        res.flash('success', 'App update settings saved.');
        res.redirect('/settings/update');
    }
    // License Key
    showLicense(req, res) {
        const row = DatabaseService_1.dbService.getOne('licens', 'id = 1');
        res.render('settings/license', { title: 'License Key', row: row || { lkey: '' }, flash: res.locals.flash });
    }
    updateLicense(req, res) {
        const { lkey } = req.body;
        const existing = DatabaseService_1.dbService.getOne('licens', 'id = 1');
        if (existing) {
            DatabaseService_1.dbService.update('licens', { lkey }, 'id = 1');
        }
        else {
            DatabaseService_1.dbService.insert('licens', { id: 1, lkey });
        }
        res.flash('success', 'License key updated.');
        res.redirect('/settings/license');
    }
    // Login Theme
    showLoginTheme(req, res) {
        const row = DatabaseService_1.dbService.getOne('logintheme', 'id = 1');
        res.render('settings/login-theme', { title: 'Login Page Theme', row: row || { themelog: 'theme_0' }, flash: res.locals.flash });
    }
    updateLoginTheme(req, res) {
        const { themelog } = req.body;
        const existing = DatabaseService_1.dbService.getOne('logintheme', 'id = 1');
        if (existing) {
            DatabaseService_1.dbService.update('logintheme', { themelog }, 'id = 1');
        }
        else {
            DatabaseService_1.dbService.insert('logintheme', { id: 1, themelog });
        }
        res.flash('success', 'Login theme updated.');
        res.redirect('/settings/login-theme');
    }
    // Login Text
    showLoginText(req, res) {
        const row = DatabaseService_1.dbService.getOne('logintext', 'id = 1');
        res.render('settings/login-text', { title: 'Login Page Text', row: row || { logintitial: '', loginsubtitial: '' }, flash: res.locals.flash });
    }
    updateLoginText(req, res) {
        const { logintitial, loginsubtitial } = req.body;
        const existing = DatabaseService_1.dbService.getOne('logintext', 'id = 1');
        if (existing) {
            DatabaseService_1.dbService.update('logintext', { logintitial, loginsubtitial }, 'id = 1');
        }
        else {
            DatabaseService_1.dbService.insert('logintext', { id: 1, logintitial, loginsubtitial });
        }
        res.flash('success', 'Login text updated.');
        res.redirect('/settings/login-text');
    }
}
exports.SettingsController = SettingsController;
//# sourceMappingURL=SettingsController.js.map