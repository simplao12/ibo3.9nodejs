import { Router } from 'express';
import { CodesController } from '../../controllers/admin/CodesController';

const router = Router();
const ctrl = new CodesController();

router.get('/', ctrl.index.bind(ctrl));
router.get('/create', ctrl.showCreate.bind(ctrl));
router.post('/create', ctrl.create.bind(ctrl));
router.post('/:id/delete', ctrl.delete.bind(ctrl));

export default router;
