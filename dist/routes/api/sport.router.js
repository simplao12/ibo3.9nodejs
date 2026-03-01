"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SportApiController_1 = require("../../controllers/api/SportApiController");
const router = (0, express_1.Router)();
const ctrl = new SportApiController_1.SportApiController();
router.get('/', ctrl.handle.bind(ctrl));
exports.default = router;
//# sourceMappingURL=sport.router.js.map