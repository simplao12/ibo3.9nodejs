"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ApiAuthController_1 = require("../../controllers/api/ApiAuthController");
const rateLimiter_1 = require("../../middleware/rateLimiter");
const router = (0, express_1.Router)();
const ctrl = new ApiAuthController_1.ApiAuthController();
router.use(rateLimiter_1.apiRateLimiter);
router.get('/', ctrl.handle.bind(ctrl));
exports.default = router;
//# sourceMappingURL=auth.router.js.map