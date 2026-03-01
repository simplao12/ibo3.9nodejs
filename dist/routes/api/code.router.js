"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CodeController_1 = require("../../controllers/api/CodeController");
const router = (0, express_1.Router)();
const ctrl = new CodeController_1.CodeController();
router.get('/', ctrl.handle.bind(ctrl));
exports.default = router;
//# sourceMappingURL=code.router.js.map