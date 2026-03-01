"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SportsController = void 0;
const DatabaseService_1 = require("../../services/DatabaseService");
const RESULTS_PER_PAGE = 10;
class SportsController {
    // Sports Settings
    showSettings(req, res) {
        const row = DatabaseService_1.dbService.getOne('sports', 'id = 1');
        res.render('sports/settings', {
            title: 'Sports Settings',
            row: row || { header_n: '', border_c: '', background_c: '', text_c: '', days: '1', api: '' },
            flash: res.locals.flash,
        });
    }
    updateSettings(req, res) {
        const { header_n, border_c, background_c, text_c, days, api } = req.body;
        const existing = DatabaseService_1.dbService.getOne('sports', 'id = 1');
        if (existing) {
            DatabaseService_1.dbService.update('sports', { header_n, border_c, background_c, text_c, days, api }, 'id = 1');
        }
        else {
            DatabaseService_1.dbService.insert('sports', { id: 1, header_n, border_c, background_c, text_c, days, api });
        }
        res.flash('success', 'Sports settings updated.');
        res.redirect('/sports/settings');
    }
    // Leagues (leaguesx)
    indexLeagues(req, res) {
        const page = parseInt(String(req.query.view || '1'), 10);
        const searchTerm = String(req.query.search || '');
        const offset = (page - 1) * RESULTS_PER_PAGE;
        let where = '';
        const params = {};
        if (searchTerm) {
            where = 'league LIKE $search';
            params.$search = `%${searchTerm}%`;
        }
        const total = DatabaseService_1.dbService.selectWithCount('leaguesx', 'id', where, params)[0]?.total ?? 0;
        const totalPages = Math.ceil(total / RESULTS_PER_PAGE);
        const rows = DatabaseService_1.dbService.selectPaged('leaguesx', '*', where, params, RESULTS_PER_PAGE, offset);
        res.render('sports/leagues', { title: 'League IDs', rows, page, totalPages, searchTerm, flash: res.locals.flash });
    }
    createLeague(req, res) {
        const { league, leagueId } = req.body;
        if (!league || !leagueId) {
            res.flash('warning', 'Please fill in all fields.');
            res.redirect('/sports/leagues');
            return;
        }
        DatabaseService_1.dbService.insert('leaguesx', { league, leagueId });
        res.flash('success', 'League ID added.');
        res.redirect('/sports/leagues');
    }
    deleteLeague(req, res) {
        const id = parseInt(req.params.id, 10);
        DatabaseService_1.dbService.delete('leaguesx', 'id = $id', { $id: id });
        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            res.json({ success: true });
            return;
        }
        res.flash('danger', 'League deleted.');
        res.redirect('/sports/leagues');
    }
    // Leagues Table (leaguestable)
    indexLeaguesTable(req, res) {
        const page = parseInt(String(req.query.view || '1'), 10);
        const searchTerm = String(req.query.search || '');
        const offset = (page - 1) * RESULTS_PER_PAGE;
        let where = '';
        const params = {};
        if (searchTerm) {
            where = 'league LIKE $search';
            params.$search = `%${searchTerm}%`;
        }
        const total = DatabaseService_1.dbService.selectWithCount('leaguestable', 'id', where, params)[0]?.total ?? 0;
        const totalPages = Math.ceil(total / RESULTS_PER_PAGE);
        const rows = DatabaseService_1.dbService.selectPaged('leaguestable', '*', where, params, RESULTS_PER_PAGE, offset);
        res.render('sports/leagues-table', { title: 'League Widget IDs', rows, page, totalPages, searchTerm, flash: res.locals.flash });
    }
    createLeagueTable(req, res) {
        const { league, leagueId } = req.body;
        if (!league || !leagueId) {
            res.flash('warning', 'Please fill in all fields.');
            res.redirect('/sports/leagues-table');
            return;
        }
        DatabaseService_1.dbService.insert('leaguestable', { league, leagueId });
        res.flash('success', 'League widget ID added.');
        res.redirect('/sports/leagues-table');
    }
    deleteLeagueTable(req, res) {
        const id = parseInt(req.params.id, 10);
        DatabaseService_1.dbService.delete('leaguestable', 'id = $id', { $id: id });
        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            res.json({ success: true });
            return;
        }
        res.flash('danger', 'League widget deleted.');
        res.redirect('/sports/leagues-table');
    }
}
exports.SportsController = SportsController;
//# sourceMappingURL=SportsController.js.map