import { Router } from 'express';
import { DnsController } from '../../controllers/admin/DnsController';

const router = Router();
const ctrl = new DnsController();

router.get('/', ctrl.index.bind(ctrl));
router.get('/create', ctrl.showCreate.bind(ctrl));
router.post('/create', ctrl.create.bind(ctrl));
router.get('/:id/edit', ctrl.showEdit.bind(ctrl));
router.post('/:id/edit', ctrl.update.bind(ctrl));
router.post('/:id/delete', ctrl.delete.bind(ctrl));

export default router;
