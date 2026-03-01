import { Router } from 'express';
import { SportsController } from '../../controllers/admin/SportsController';

const router = Router();
const ctrl = new SportsController();

router.get('/settings', ctrl.showSettings.bind(ctrl));
router.post('/settings', ctrl.updateSettings.bind(ctrl));

router.get('/leagues', ctrl.indexLeagues.bind(ctrl));
router.post('/leagues/create', ctrl.createLeague.bind(ctrl));
router.post('/leagues/:id/delete', ctrl.deleteLeague.bind(ctrl));

router.get('/leagues-table', ctrl.indexLeaguesTable.bind(ctrl));
router.post('/leagues-table/create', ctrl.createLeagueTable.bind(ctrl));
router.post('/leagues-table/:id/delete', ctrl.deleteLeagueTable.bind(ctrl));

export default router;
