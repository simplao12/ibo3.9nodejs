import { Router } from 'express';
import { SaveDataController } from '../../controllers/api/SaveDataController';

const router = Router();
const ctrl = new SaveDataController();

router.get('/', ctrl.handle.bind(ctrl));

export default router;
