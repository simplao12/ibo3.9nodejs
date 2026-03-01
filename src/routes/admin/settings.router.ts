import { Router } from 'express';
import { SettingsController } from '../../controllers/admin/SettingsController';

const router = Router();
const ctrl = new SettingsController();

router.get('/notification', ctrl.showNotification.bind(ctrl));
router.post('/notification', ctrl.updateNotification.bind(ctrl));

router.get('/mac-length', ctrl.showMacLength.bind(ctrl));
router.post('/mac-length', ctrl.updateMacLength.bind(ctrl));

router.get('/demo', ctrl.showDemo.bind(ctrl));
router.post('/demo', ctrl.updateDemo.bind(ctrl));

router.get('/update', ctrl.showUpdate.bind(ctrl));
router.post('/update', ctrl.updateUpdate.bind(ctrl));

router.get('/license', ctrl.showLicense.bind(ctrl));
router.post('/license', ctrl.updateLicense.bind(ctrl));

router.get('/login-theme', ctrl.showLoginTheme.bind(ctrl));
router.post('/login-theme', ctrl.updateLoginTheme.bind(ctrl));

router.get('/login-text', ctrl.showLoginText.bind(ctrl));
router.post('/login-text', ctrl.updateLoginText.bind(ctrl));

export default router;
