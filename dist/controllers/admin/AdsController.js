"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdsController = void 0;
const DatabaseService_1 = require("../../services/DatabaseService");
class AdsController {
    // Ads Type
    showType(req, res) {
        const row = DatabaseService_1.dbService.getOne('adssettings', 'id = 1');
        res.render('ads/type', { title: 'Ads Type', row: row || { adstype: '0' }, flash: res.locals.flash });
    }
    updateType(req, res) {
        const { adstype } = req.body;
        const existing = DatabaseService_1.dbService.getOne('adssettings', 'id = 1');
        if (existing) {
            DatabaseService_1.dbService.update('adssettings', { adstype }, 'id = 1');
        }
        else {
            DatabaseService_1.dbService.insert('adssettings', { id: 1, adstype });
        }
        res.flash('success', 'Ads type updated.');
        res.redirect('/ads/type');
    }
    // Auto Ads Layout
    showAutoLayout(req, res) {
        const row = DatabaseService_1.dbService.getOne('autolayout', 'id = 1');
        res.render('ads/auto-layout', { title: 'Auto Ads Layout', row: row || { layout: '0' }, flash: res.locals.flash });
    }
    updateAutoLayout(req, res) {
        const { layout } = req.body;
        const existing = DatabaseService_1.dbService.getOne('autolayout', 'id = 1');
        if (existing) {
            DatabaseService_1.dbService.update('autolayout', { layout }, 'id = 1');
        }
        else {
            DatabaseService_1.dbService.insert('autolayout', { id: 1, layout });
        }
        res.flash('success', 'Auto ads layout updated.');
        res.redirect('/ads/auto-layout');
    }
    // Frame Ads Layout
    showFrameLayout(req, res) {
        const row = DatabaseService_1.dbService.getOne('framelayout', 'id = 1');
        res.render('ads/frame-layout', { title: 'Frame Ads Layout', row: row || { layout: '0' }, flash: res.locals.flash });
    }
    updateFrameLayout(req, res) {
        const { layout } = req.body;
        const existing = DatabaseService_1.dbService.getOne('framelayout', 'id = 1');
        if (existing) {
            DatabaseService_1.dbService.update('framelayout', { layout }, 'id = 1');
        }
        else {
            DatabaseService_1.dbService.insert('framelayout', { id: 1, layout });
        }
        res.flash('success', 'Frame ads layout updated.');
        res.redirect('/ads/frame-layout');
    }
    // Manual Ads
    indexManual(req, res) {
        const rows = DatabaseService_1.dbService.select('menuads', '*', '', 'id ASC');
        res.render('ads/manual/index', { title: 'Manual Ads', rows, flash: res.locals.flash });
    }
    showCreateManual(req, res) {
        res.render('ads/manual/create', { title: 'Create Manual Ad', flash: [] });
    }
    createManual(req, res) {
        const { title, url } = req.body;
        if (!title || !url) {
            res.flash('warning', 'Please fill in all fields.');
            res.redirect('/ads/manual/create');
            return;
        }
        DatabaseService_1.dbService.insert('menuads', { title, url });
        res.flash('success', 'Manual ad created.');
        res.redirect('/ads/manual');
    }
    showEditManual(req, res) {
        const id = parseInt(req.params.id, 10);
        const row = DatabaseService_1.dbService.getOne('menuads', 'id = $id', { $id: id });
        if (!row) {
            res.flash('danger', 'Ad not found.');
            res.redirect('/ads/manual');
            return;
        }
        res.render('ads/manual/edit', { title: 'Edit Manual Ad', row, flash: [] });
    }
    updateManual(req, res) {
        const id = parseInt(req.params.id, 10);
        const { title, url } = req.body;
        if (!title || !url) {
            res.flash('warning', 'Please fill in all fields.');
            res.redirect(`/ads/manual/${id}/edit`);
            return;
        }
        DatabaseService_1.dbService.update('menuads', { title, url }, 'id = $id', { $id: id });
        res.flash('success', 'Ad updated.');
        res.redirect('/ads/manual');
    }
    deleteManual(req, res) {
        const id = parseInt(req.params.id, 10);
        DatabaseService_1.dbService.delete('menuads', 'id = $id', { $id: id });
        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            res.json({ success: true });
            return;
        }
        res.flash('danger', 'Ad deleted.');
        res.redirect('/ads/manual');
    }
}
exports.AdsController = AdsController;
//# sourceMappingURL=AdsController.js.map