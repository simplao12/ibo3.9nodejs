import { Router } from 'express';
import { ThemesController } from '../../controllers/admin/ThemesController';

const router = Router();
const ctrl = new ThemesController();

router.get('/', ctrl.index.bind(ctrl));
router.post('/', ctrl.update.bind(ctrl));

export default router;
