"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiAuthController = void 0;
const DatabaseService_1 = require("../../services/DatabaseService");
const EncryptionService_1 = require("../../services/EncryptionService");
const HttpService_1 = require("../../services/HttpService");
function outEcho(res, status) {
    const data = status === 1
        ? { status: 'success', data: 'Login successful.' }
        : { status: 'unsuccess', data: 'Invalid username/password or account has expired.' };
    const final = (0, EncryptionService_1.simpleEncrypt)(JSON.stringify(data));
    res.set('Content-Type', 'application/json; charset=UTF-8');
    res.json({ peterparker: final });
}
class ApiAuthController {
    async handle(req, res) {
        const { username, password } = req.query;
        if (!username || !password) {
            outEcho(res, 2);
            return;
        }
        // Check panel (menualuser) first
        const panelUsers = DatabaseService_1.dbService.select('menualuser', '*', 'username = $username', '', { $username: username });
        if (panelUsers.length > 0) {
            const pu = panelUsers[0];
            const expiredTs = pu.expire_date ? Date.now() > new Date(pu.expire_date).getTime() : true;
            if (!expiredTs && pu.username === username && pu.password === password) {
                outEcho(res, 1);
                return;
            }
        }
        // Check DNS servers
        const dnsRows = DatabaseService_1.dbService.select('dns', '*');
        let found = false;
        for (const row of dnsRows) {
            const apiLink = `${row.url}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
            const result = await (0, HttpService_1.callLink)(apiLink);
            if (result.result === 'success') {
                const data = result.data;
                if (data?.user_info?.auth && data.user_info.auth !== 0 && data.user_info.status === 'Active') {
                    outEcho(res, 1);
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            outEcho(res, 2);
        }
    }
}
exports.ApiAuthController = ApiAuthController;
//# sourceMappingURL=ApiAuthController.js.map