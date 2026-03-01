"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUserController = void 0;
const DatabaseService_1 = require("../../services/DatabaseService");
const EncryptionService_1 = require("../../services/EncryptionService");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function getUserData(macAddress) {
    const mac = macAddress.toLowerCase();
    const rows = DatabaseService_1.dbService.raw('SELECT * FROM ibo WHERE LOWER(mac_address) = ?', { mac });
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
function getExpired(macAddress) {
    const mac = macAddress.toLowerCase();
    const row = DatabaseService_1.dbService.raw('SELECT expire_date FROM trial WHERE LOWER(mac_address) = ?', { mac });
    return row?.[0]?.expire_date || '2033-03-13';
}
function getLang() {
    try {
        const langPath = path_1.default.join(process.cwd(), 'public', 'json', 'language.json');
        return fs_1.default.readFileSync(langPath, 'utf8');
    }
    catch {
        return '{}';
    }
}
class AppUserController {
    handle(req, res) {
        try {
            const postData = req.body;
            if (!postData.data) {
                res.status(400).json({ error: 'Invalid request' });
                return;
            }
            const decoded = (0, EncryptionService_1.getDecodedString)(postData.data);
            const jsonData = JSON.parse(decoded);
            // Get settings from DB
            const mes = DatabaseService_1.dbService.getOne('welcome', 'id = 1');
            const mec = DatabaseService_1.dbService.getOne('macl', 'id = 1');
            const theme = DatabaseService_1.dbService.getOne('theme', 'id = 1');
            const update = DatabaseService_1.dbService.getOne('appupdate', 'id = 1');
            const licens = DatabaseService_1.dbService.getOne('licens', 'id = 1');
            const demo = DatabaseService_1.dbService.getOne('demopls', 'id = 1');
            const lthemes = DatabaseService_1.dbService.getOne('logintheme', 'id = 1');
            const logintxt = DatabaseService_1.dbService.getOne('logintext', 'id = 1');
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
            let macRaw = (0, EncryptionService_1.getDecodedString)(jsonData.app_device_id);
            macRaw = macRaw.substring(0, macLen);
            // chunk_split equivalent: insert : every 2 chars
            let macAddress = '';
            for (let i = 0; i < macRaw.length; i += 2) {
                macAddress += macRaw.substring(i, i + 2);
                if (i + 2 < macRaw.length)
                    macAddress += ':';
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
            const response = { data: (0, EncryptionService_1.getEncodedString)(outputJson) };
            res.set({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true',
                'Cache-Control': 'no-cache, private',
                'Content-Type': 'application/json',
            });
            res.status(200).json(response);
        }
        catch (err) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.AppUserController = AppUserController;
//# sourceMappingURL=AppUserController.js.map