import { Request, Response } from 'express';
import { db } from '../../config/database';
import { getDecodedString, getEncodedString } from '../../services/EncryptionService';
import path from 'path';
import fs from 'fs';

function getUserData(macAddress: string): { urls: string } {
  const mac = macAddress.toLowerCase();
  const rows = db.prepare('SELECT * FROM ibo WHERE LOWER(mac_address) = ?').all(mac) as Array<{
    id: number; protection: string; password: string; url: string; username: string; title: string;
  }>;

  const urls = rows.map((row) => ({
    is_protected: row.protection,
    id: require('crypto').createHash('md5').update(row.password).digest('hex') + 'RTXREBRAND' + row.id,
    url: `${row.url}/get.php?username=${row.username}&password=${row.password}&type=m3u_plus&output=ts`,
    name: row.title,
    created_at: '2023-04-15 00:06:09',
    updated_at: '2023-04-15 00:06:09',
  }));

  return { urls: JSON.stringify(urls) };
}

function getExpired(macAddress: string): string {
  const mac = macAddress.toLowerCase();
  const row = db.prepare('SELECT expire_date FROM trial WHERE LOWER(mac_address) = ?').get(mac) as { expire_date: string } | undefined;
  return row?.expire_date || '2033-03-13';
}

function getLang(): string {
  try {
    const langPath = path.join(process.cwd(), 'public', 'json', 'language.json');
    return fs.readFileSync(langPath, 'utf8');
  } catch {
    return '{}';
  }
}

export class AppUserController {
  handle(req: Request, res: Response): void {
    try {
      const postData = req.body as { data?: string };
      if (!postData.data) {
        res.status(400).json({ error: 'Invalid request' });
        return;
      }

      const decoded = getDecodedString(postData.data);
      const jsonData = JSON.parse(decoded) as { app_device_id: string };

      // Get settings from DB
      const mes = db.prepare('SELECT * FROM welcome WHERE id = 1').get() as { message_one: string; message_two: string } | undefined;
      const mec = db.prepare('SELECT * FROM macl WHERE id = 1').get() as { mac_length: string } | undefined;
      const theme = db.prepare('SELECT * FROM theme WHERE id = 1').get() as { theme_no: string } | undefined;
      const update = db.prepare('SELECT * FROM appupdate WHERE id = 1').get() as { nversion: string; nurl: string } | undefined;
      const licens = db.prepare('SELECT * FROM licens WHERE id = 1').get() as { lkey: string } | undefined;
      const demo = db.prepare('SELECT * FROM demopls WHERE id = 1').get() as { mplname: string; mdns: string; muser: string; mpass: string } | undefined;
      const lthemes = db.prepare('SELECT * FROM logintheme WHERE id = 1').get() as { themelog: string } | undefined;
      const logintxt = db.prepare('SELECT * FROM logintext WHERE id = 1').get() as { logintitial: string; loginsubtitial: string } | undefined;

      // Build values (port of PHP logic)
      const macLen = parseInt(mec?.mac_length || '12', 10) || 12;
      const updateVersion = update?.nversion || '3.9';
      const updateUrl = update?.nurl || 'https://t.me/SaNoJRTX';
      const licenseKey = licens?.lkey || 'null';
      const currentTheme = theme?.theme_no || 'theme_0';
      const loginTheme = lthemes?.themelog || 'theme_0';
      const messageOne = mes?.message_one ? Buffer.from(mes.message_one).toString('base64') : '';
      const messageTwo = mes?.message_two ? Buffer.from(mes.message_two).toString('base64') : '';
      const loginTxt1 = logintxt?.logintitial ? Buffer.from(logintxt.logintitial).toString('base64') : '';
      const loginTxt2 = logintxt?.loginsubtitial ? Buffer.from(logintxt.loginsubtitial).toString('base64') : '';

      // Process MAC address (port of PHP logic)
      let macRaw = getDecodedString(jsonData.app_device_id);
      macRaw = macRaw.substring(0, macLen);
      // chunk_split equivalent: insert : every 2 chars
      let macAddress = '';
      for (let i = 0; i < macRaw.length; i += 2) {
        macAddress += macRaw.substring(i, i + 2);
        if (i + 2 < macRaw.length) macAddress += ':';
      }

      const result = getUserData(macAddress);
      const expireDate = getExpired(macAddress);
      const userData = result.urls;

      // Demo playlist
      let demoPlaylist = '[]';
      if (demo?.mdns) {
        const urlsDemoArr = [{
          is_protected: '1',
          id: '11f1c6c52a212ad96288f8c004fb9148RTXREBRAND',
          url: `${demo.mdns}/get.php?username=${demo.muser}&password=${demo.mpass}&type=m3u_plus&output=ts`,
          name: demo.mplname,
          created_at: '2023-04-15 00:06:09',
          updated_at: '2023-04-15 00:06:09',
        }];
        demoPlaylist = JSON.stringify(urlsDemoArr);
      }

      const urlsToUse = userData !== '[]' ? userData : demoPlaylist;
      const langJson = getLang();

      const outputJson = `{
"android_version_code":"${updateVersion}",
"apk_url":"${updateUrl}",
"device_key":"136115",
"notification_tital":"${messageOne}",
"notification_content":"${messageTwo}",
"login_tital":"${loginTxt1}",
"login_content":"${loginTxt2}",
"licen_key":"${licenseKey}",
"expire_date":"${expireDate}",
"is_google_paid":true,
"app_themes":"${currentTheme}",
"log_themes":"${userData !== '[]' ? loginTheme : currentTheme}",
"is_trial":0,
"notification":{"title":"IBO PLAYER by appsnscripts","content":"ibo player "},
"urls":${urlsToUse},
"mac_registered":true,
"themes":"",
"trial_days":360,
"plan_id":"03370629",
"mac_address":"${macAddress}",
"pin":"0000",
"price":"0",
"app_version":"${updateVersion}",
"is_show":true,
"is_ib_show":true,
"subtitleAPIKey":"elTMMQhCQhUOLL1m5Y713lobS7o1cOGt",
"subtitleAPIKeySS":"elTMMQhCQhUOLL1m5Y713lobS7o1cOGt",
"languages":[${langJson}],
"apk_link":"${updateUrl}"}`;

      const response = { data: getEncodedString(outputJson) };

      res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Cache-Control': 'no-cache, private',
        'Content-Type': 'application/json',
      });
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
