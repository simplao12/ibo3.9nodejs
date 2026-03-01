"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MediaController_1 = require("../../controllers/api/MediaController");
const router = (0, express_1.Router)();
const ctrl = new MediaController_1.MediaController();
router.get('/', ctrl.handle.bind(ctrl));
exports.default = router;
//# sourceMappingURL=media.router.js.map