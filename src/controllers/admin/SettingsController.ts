import { Request, Response } from 'express';
import { dbService } from '../../services/DatabaseService';

export class SettingsController {
  // Notification (welcome messages)
  showNotification(req: Request, res: Response): void {
    const row = dbService.getOne('welcome', 'id = 1') as { message_one: string; message_two: string } | undefined;
    res.render('settings/notification', { title: 'Set Notification', row: row || { message_one: '', message_two: '' }, flash: res.locals.flash });
  }

  updateNotification(req: Request, res: Response): void {
    const { message_one, message_two } = req.body as Record<string, string>;
    const existing = dbService.getOne('welcome', 'id = 1');
    if (existing) {
      dbService.update('welcome', { message_one, message_two }, 'id = 1');
    } else {
      dbService.insert('welcome', { id: 1, message_one, message_two });
    }
    res.flash('success', 'Notification messages updated.');
    res.redirect('/settings/notification');
  }

  // MAC Address Length
  showMacLength(req: Request, res: Response): void {
    const row = dbService.getOne('macl', 'id = 1') as { mac_length: string } | undefined;
    res.render('settings/mac-length', { title: 'Set MAC Length', row: row || { mac_length: '12' }, flash: res.locals.flash });
  }

  updateMacLength(req: Request, res: Response): void {
    const { mac_length } = req.body as Record<string, string>;
    const existing = dbService.getOne('macl', 'id = 1');
    if (existing) {
      dbService.update('macl', { mac_length }, 'id = 1');
    } else {
      dbService.insert('macl', { id: 1, mac_length });
    }
    res.flash('success', 'MAC address length updated.');
    res.redirect('/settings/mac-length');
  }

  // Demo Playlist
  showDemo(req: Request, res: Response): void {
    const row = dbService.getOne('demopls', 'id = 1') as { mplname: string; mdns: string; muser: string; mpass: string } | undefined;
    res.render('settings/demo', { title: 'Demo Playlist', row: row || { mplname: '', mdns: '', muser: '', mpass: '' }, flash: res.locals.flash });
  }

  updateDemo(req: Request, res: Response): void {
    const { mplname, mdns, muser, mpass } = req.body as Record<string, string>;
    const existing = dbService.getOne('demopls', 'id = 1');
    if (existing) {
      dbService.update('demopls', { mplname, mdns, muser, mpass }, 'id = 1');
    } else {
      dbService.insert('demopls', { id: 1, mplname, mdns, muser, mpass });
    }
    res.flash('success', 'Demo playlist updated.');
    res.redirect('/settings/demo');
  }

  // App Update
  showUpdate(req: Request, res: Response): void {
    const row = dbService.getOne('appupdate', 'id = 1') as { nversion: string; nurl: string } | undefined;
    res.render('settings/update', { title: 'Remote Update', row: row || { nversion: '3.9', nurl: '' }, flash: res.locals.flash });
  }

  updateUpdate(req: Request, res: Response): void {
    const { nversion, nurl } = req.body as Record<string, string>;
    const existing = dbService.getOne('appupdate', 'id = 1');
    if (existing) {
      dbService.update('appupdate', { nversion, nurl }, 'id = 1');
    } else {
      dbService.insert('appupdate', { id: 1, nversion, nurl });
    }
    res.flash('success', 'App update settings saved.');
    res.redirect('/settings/update');
  }

  // License Key
  showLicense(req: Request, res: Response): void {
    const row = dbService.getOne('licens', 'id = 1') as { lkey: string } | undefined;
    res.render('settings/license', { title: 'License Key', row: row || { lkey: '' }, flash: res.locals.flash });
  }

  updateLicense(req: Request, res: Response): void {
    const { lkey } = req.body as Record<string, string>;
    const existing = dbService.getOne('licens', 'id = 1');
    if (existing) {
      dbService.update('licens', { lkey }, 'id = 1');
    } else {
      dbService.insert('licens', { id: 1, lkey });
    }
    res.flash('success', 'License key updated.');
    res.redirect('/settings/license');
  }

  // Login Theme
  showLoginTheme(req: Request, res: Response): void {
    const row = dbService.getOne('logintheme', 'id = 1') as { themelog: string } | undefined;
    res.render('settings/login-theme', { title: 'Login Page Theme', row: row || { themelog: 'theme_0' }, flash: res.locals.flash });
  }

  updateLoginTheme(req: Request, res: Response): void {
    const { themelog } = req.body as Record<string, string>;
    const existing = dbService.getOne('logintheme', 'id = 1');
    if (existing) {
      dbService.update('logintheme', { themelog }, 'id = 1');
    } else {
      dbService.insert('logintheme', { id: 1, themelog });
    }
    res.flash('success', 'Login theme updated.');
    res.redirect('/settings/login-theme');
  }

  // Login Text
  showLoginText(req: Request, res: Response): void {
    const row = dbService.getOne('logintext', 'id = 1') as { logintitial: string; loginsubtitial: string } | undefined;
    res.render('settings/login-text', { title: 'Login Page Text', row: row || { logintitial: '', loginsubtitial: '' }, flash: res.locals.flash });
  }

  updateLoginText(req: Request, res: Response): void {
    const { logintitial, loginsubtitial } = req.body as Record<string, string>;
    const existing = dbService.getOne('logintext', 'id = 1');
    if (existing) {
      dbService.update('logintext', { logintitial, loginsubtitial }, 'id = 1');
    } else {
      dbService.insert('logintext', { id: 1, logintitial, loginsubtitial });
    }
    res.flash('success', 'Login text updated.');
    res.redirect('/settings/login-text');
  }
}
