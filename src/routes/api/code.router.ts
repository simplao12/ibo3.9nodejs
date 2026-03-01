import { Router } from 'express';
import { CodeController } from '../../controllers/api/CodeController';

const router = Router();
const ctrl = new CodeController();

router.get('/', ctrl.handle.bind(ctrl));

export default router;
