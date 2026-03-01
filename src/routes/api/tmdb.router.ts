import { Router } from 'express';
import { TmdbController } from '../../controllers/api/TmdbController';

const router = Router();
const ctrl = new TmdbController();

router.get('/', ctrl.handle.bind(ctrl));

export default router;
