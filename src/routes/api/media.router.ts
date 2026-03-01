import { Router } from 'express';
import { MediaController } from '../../controllers/api/MediaController';

const router = Router();
const ctrl = new MediaController();

router.get('/', ctrl.handle.bind(ctrl));

export default router;
