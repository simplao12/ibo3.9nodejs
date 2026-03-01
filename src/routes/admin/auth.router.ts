import { Router } from 'express';
import { AuthController } from '../../controllers/admin/AuthController';
import { loginRateLimiter } from '../../middleware/rateLimiter';
import { csrfMiddleware } from '../../middleware/csrf';

const router = Router();
const ctrl = new AuthController();

router.get('/', csrfMiddleware, ctrl.showLogin.bind(ctrl));
router.post('/', loginRateLimiter, csrfMiddleware, ctrl.login.bind(ctrl));
router.get('/logout', ctrl.logout.bind(ctrl));

export default router;
