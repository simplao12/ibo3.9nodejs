"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodesController = void 0;
const DatabaseService_1 = require("../../services/DatabaseService");
const RESULTS_PER_PAGE = 10;
class CodesController {
    index(req, res) {
        const page = parseInt(String(req.query.view || '1'), 10);
        const searchTerm = String(req.query.search || '');
        const offset = (page - 1) * RESULTS_PER_PAGE;
        let where = '';
        const params = {};
        if (searchTerm) {
            where = 'ac_code LIKE $search';
            params.$search = `%${searchTerm}%`;
        }
        const countResult = DatabaseService_1.dbService.selectWithCount('ibocode', 'id', where, params);
        const total = countResult[0]?.total ?? 0;
        const totalPages = Math.ceil(total / RESULTS_PER_PAGE);
        const codes = DatabaseService_1.dbService.selectPaged('ibocode', '*', where, params, RESULTS_PER_PAGE, offset);
        res.render('codes/index', {
            title: 'Activation Codes',
            codes,
            page,
            totalPages,
            searchTerm,
            flash: res.locals.flash,
        });
    }
    showCreate(req, res) {
        // Auto-generate code (timestamp based, 8 digits) - port of PHP code_create.php
        const autoCode = String(Date.now()).slice(-8);
        res.render('codes/create', { title: 'Create Activation Code', autoCode, flash: [] });
    }
    create(req, res) {
        const { ac_code, url, username, password } = req.body;
        if (!ac_code || !url || !username || !password) {
            res.flash('warning', 'Please fill in all required fields.');
            res.redirect('/codes/create');
            return;
        }
        DatabaseService_1.dbService.insert('ibocode', { ac_code, url, username, password, status: 'NotUsed' });
        res.flash('success', 'Activation code created.');
        res.redirect('/codes');
    }
    delete(req, res) {
        const id = parseInt(req.params.id, 10);
        DatabaseService_1.dbService.delete('ibocode', 'id = $id', { $id: id });
        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            res.json({ success: true });
            return;
        }
        res.flash('danger', 'Activation code deleted.');
        res.redirect('/codes');
    }
}
exports.CodesController = CodesController;
//# sourceMappingURL=CodesController.js.map