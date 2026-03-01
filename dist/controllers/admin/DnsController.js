"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsController = void 0;
const DatabaseService_1 = require("../../services/DatabaseService");
class DnsController {
    index(req, res) {
        const rows = DatabaseService_1.dbService.select('dns', '*', '', 'id ASC');
        res.render('dns/index', {
            title: 'DNS Settings',
            rows,
            flash: res.locals.flash,
        });
    }
    showCreate(req, res) {
        res.render('dns/create', { title: 'New DNS/User', flash: [] });
    }
    create(req, res) {
        const { title, url } = req.body;
        if (!title || !url) {
            res.flash('warning', 'Please fill in all fields.');
            res.redirect('/dns/create');
            return;
        }
        DatabaseService_1.dbService.insert('dns', { title, url });
        res.flash('success', 'DNS entry added successfully.');
        res.redirect('/dns');
    }
    showEdit(req, res) {
        const id = parseInt(req.params.id, 10);
        const row = DatabaseService_1.dbService.getOne('dns', 'id = $id', { $id: id });
        if (!row) {
            res.flash('danger', 'DNS entry not found.');
            res.redirect('/dns');
            return;
        }
        res.render('dns/edit', { title: 'Edit DNS/User', row, flash: [] });
    }
    update(req, res) {
        const id = parseInt(req.params.id, 10);
        const { title, url } = req.body;
        if (!title || !url) {
            res.flash('warning', 'Please fill in all fields.');
            res.redirect(`/dns/${id}/edit`);
            return;
        }
        DatabaseService_1.dbService.update('dns', { title, url }, 'id = $id', { $id: id });
        res.flash('success', 'DNS entry updated successfully.');
        res.redirect('/dns');
    }
    delete(req, res) {
        const id = parseInt(req.params.id, 10);
        DatabaseService_1.dbService.delete('dns', 'id = $id', { $id: id });
        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            res.json({ success: true });
            return;
        }
        res.flash('danger', 'DNS entry deleted.');
        res.redirect('/dns');
    }
}
exports.DnsController = DnsController;
//# sourceMappingURL=DnsController.js.map