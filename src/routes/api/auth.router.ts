import { Router } from 'express';
import { ApiAuthController } from '../../controllers/api/ApiAuthController';
import { apiRateLimiter } from '../../middleware/rateLimiter';

const router = Router();
const ctrl = new ApiAuthController();

router.use(apiRateLimiter);
router.get('/', ctrl.handle.bind(ctrl));

export default router;
