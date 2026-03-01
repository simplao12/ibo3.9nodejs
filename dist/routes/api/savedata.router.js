"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SaveDataController_1 = require("../../controllers/api/SaveDataController");
const router = (0, express_1.Router)();
const ctrl = new SaveDataController_1.SaveDataController();
router.get('/', ctrl.handle.bind(ctrl));
exports.default = router;
//# sourceMappingURL=savedata.router.js.map