"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ThemesController_1 = require("../../controllers/admin/ThemesController");
const router = (0, express_1.Router)();
const ctrl = new ThemesController_1.ThemesController();
router.get('/', ctrl.index.bind(ctrl));
router.post('/', ctrl.update.bind(ctrl));
exports.default = router;
//# sourceMappingURL=themes.router.js.map