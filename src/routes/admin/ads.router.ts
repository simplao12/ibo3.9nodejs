import { Router } from 'express';
import { AdsController } from '../../controllers/admin/AdsController';

const router = Router();
const ctrl = new AdsController();

router.get('/type', ctrl.showType.bind(ctrl));
router.post('/type', ctrl.updateType.bind(ctrl));

router.get('/auto-layout', ctrl.showAutoLayout.bind(ctrl));
router.post('/auto-layout', ctrl.updateAutoLayout.bind(ctrl));

router.get('/frame-layout', ctrl.showFrameLayout.bind(ctrl));
router.post('/frame-layout', ctrl.updateFrameLayout.bind(ctrl));

router.get('/manual', ctrl.indexManual.bind(ctrl));
router.get('/manual/create', ctrl.showCreateManual.bind(ctrl));
router.post('/manual/create', ctrl.createManual.bind(ctrl));
router.get('/manual/:id/edit', ctrl.showEditManual.bind(ctrl));
router.post('/manual/:id/edit', ctrl.updateManual.bind(ctrl));
router.post('/manual/:id/delete', ctrl.deleteManual.bind(ctrl));

export default router;
