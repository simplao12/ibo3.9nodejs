import { Router } from 'express';
import { TrialController } from '../../controllers/admin/TrialController';

const router = Router();
const ctrl = new TrialController();

router.get('/', ctrl.index.bind(ctrl));
router.get('/create', ctrl.showCreate.bind(ctrl));
router.post('/create', ctrl.create.bind(ctrl));
router.get('/:id/edit', ctrl.showEdit.bind(ctrl));
router.post('/:id/edit', ctrl.update.bind(ctrl));
router.post('/:id/delete', ctrl.delete.bind(ctrl));

export default router;
