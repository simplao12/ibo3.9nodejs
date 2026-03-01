"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../../controllers/admin/AuthController");
const rateLimiter_1 = require("../../middleware/rateLimiter");
const csrf_1 = require("../../middleware/csrf");
const router = (0, express_1.Router)();
const ctrl = new AuthController_1.AuthController();
router.get('/', csrf_1.csrfMiddleware, ctrl.showLogin.bind(ctrl));
router.post('/', rateLimiter_1.loginRateLimiter, csrf_1.csrfMiddleware, ctrl.login.bind(ctrl));
router.get('/logout', ctrl.logout.bind(ctrl));
exports.default = router;
//# sourceMappingURL=auth.router.js.map