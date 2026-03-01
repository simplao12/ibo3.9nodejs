"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AppUserController_1 = require("../../controllers/api/AppUserController");
const rateLimiter_1 = require("../../middleware/rateLimiter");
const router = (0, express_1.Router)();
const ctrl = new AppUserController_1.AppUserController();
router.use(rateLimiter_1.apiRateLimiter);
router.post('/', ctrl.handle.bind(ctrl));
exports.default = router;
//# sourceMappingURL=appuser.router.js.map