"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeController = void 0;
const DatabaseService_1 = require("../../services/DatabaseService");
class CodeController {
    handle(req, res) {
        const accode = String(req.query.accode || '');
        res.set('Content-Type', 'application/json; charset=UTF-8');
        if (!accode) {
            res.json({ status: 'unsuccess', dns: 'Invalid username/password or account has expired.' });
            return;
        }
        const rows = DatabaseService_1.dbService.select('ibocode', '*', 'ac_code = $code', '', { $code: accode });
        if (!rows.length || rows[0].ac_code !== accode) {
            res.json({ status: 'unsuccess', dns: 'Invalid username/password or account has expired.' });
            return;
        }
        const row = rows[0];
        if (row.status === 'USED' || !row.status) {
            res.json({ status: 'unsuccess', dns: 'This code has already been used' });
            return;
        }
        // Mark as used
        DatabaseService_1.dbService.update('ibocode', { status: 'USED' }, 'ac_code = $code', { $code: accode });
        res.json({
            status: 'success',
            dns: row.url,
            username: row.username,
            password: row.password,
        });
    }
}
exports.CodeController = CodeController;
//# sourceMappingURL=CodeController.js.map