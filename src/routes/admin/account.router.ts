import { Router } from 'express';
import { AccountController } from '../../controllers/admin/AccountController';

const router = Router();
const ctrl = new AccountController();

router.get('/', ctrl.show.bind(ctrl));
router.post('/', ctrl.update.bind(ctrl));

export default router;
