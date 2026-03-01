import { Router } from 'express';
import { SportApiController } from '../../controllers/api/SportApiController';

const router = Router();
const ctrl = new SportApiController();

router.get('/', ctrl.handle.bind(ctrl));

export default router;
