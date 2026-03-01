import { Router } from 'express';
import { AppUserController } from '../../controllers/api/AppUserController';
import { apiRateLimiter } from '../../middleware/rateLimiter';

const router = Router();
const ctrl = new AppUserController();

router.use(apiRateLimiter);
router.post('/', ctrl.handle.bind(ctrl));

export default router;
