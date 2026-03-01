"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SportsController_1 = require("../../controllers/admin/SportsController");
const router = (0, express_1.Router)();
const ctrl = new SportsController_1.SportsController();
router.get('/settings', ctrl.showSettings.bind(ctrl));
router.post('/settings', ctrl.updateSettings.bind(ctrl));
router.get('/leagues', ctrl.indexLeagues.bind(ctrl));
router.post('/leagues/create', ctrl.createLeague.bind(ctrl));
router.post('/leagues/:id/delete', ctrl.deleteLeague.bind(ctrl));
router.get('/leagues-table', ctrl.indexLeaguesTable.bind(ctrl));
router.post('/leagues-table/create', ctrl.createLeagueTable.bind(ctrl));
router.post('/leagues-table/:id/delete', ctrl.deleteLeagueTable.bind(ctrl));
exports.default = router;
//# sourceMappingURL=sports.router.js.map