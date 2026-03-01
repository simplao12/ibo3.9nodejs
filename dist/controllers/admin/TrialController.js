"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrialController = void 0;
const DatabaseService_1 = require("../../services/DatabaseService");
class TrialController {
    index(req, res) {
        const rows = DatabaseService_1.dbService.select('trial', '*', '', 'id ASC');
        res.render('trial/index', {
            title: 'Expiration Dates',
            rows,
            flash: res.locals.flash,
        });
    }
    showCreate(req, res) {
        const mac = String(req.query.mac || '').toUpperCase();
        res.render('trial/create', { title: 'Setup Trial', mac, flash: [] });
    }
    create(req, res) {
        const { mac_address, expire_date } = req.body;
        if (!mac_address || !expire_date) {
            res.flash('warning', 'Please fill in all fields.');
            res.redirect('/trial/create');
            return;
        }
        // Enforce one subscription per MAC address
        const existing = DatabaseService_1.dbService.selectWithCount('trial', 'mac_address', 'mac_address = $mac', {
            $mac: mac_address,
        });
        if (existing[0]?.total > 0) {
            res.flash('warning', 'Only one subscription period can be added per MAC address. Edit existing entry to change it.');
            res.redirect('/trial/create');
            return;
        }
        DatabaseService_1.dbService.insert('trial', { mac_address, expire_date });
        res.flash('success', 'Trial expiration date set.');
        res.redirect('/trial');
    }
    showEdit(req, res) {
        const id = parseInt(req.params.id, 10);
        const row = DatabaseService_1.dbService.getOne('trial', 'id = $id', { $id: id });
        if (!row) {
            res.flash('danger', 'Trial entry not found.');
            res.redirect('/trial');
            return;
        }
        res.render('trial/edit', { title: 'Edit Trial', row, flash: [] });
    }
    update(req, res) {
        const id = parseInt(req.params.id, 10);
        const { expire_date } = req.body;
        if (!expire_date) {
            res.flash('warning', 'Please provide an expiration date.');
            res.redirect(`/trial/${id}/edit`);
            return;
        }
        DatabaseService_1.dbService.update('trial', { expire_date }, 'id = $id', { $id: id });
        res.flash('success', 'Expiration date updated.');
        res.redirect('/trial');
    }
    delete(req, res) {
        const id = parseInt(req.params.id, 10);
        DatabaseService_1.dbService.delete('trial', 'id = $id', { $id: id });
        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            res.json({ success: true });
            return;
        }
        res.flash('danger', 'Trial entry deleted.');
        res.redirect('/trial');
    }
}
exports.TrialController = TrialController;
//# sourceMappingURL=TrialController.js.map