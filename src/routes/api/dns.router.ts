import { Router } from 'express';
import { DnsApiController } from '../../controllers/api/DnsApiController';

const router = Router();
const ctrl = new DnsApiController();

router.get('/', ctrl.handle.bind(ctrl));

export default router;
