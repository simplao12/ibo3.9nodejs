"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CodesController_1 = require("../../controllers/admin/CodesController");
const router = (0, express_1.Router)();
const ctrl = new CodesController_1.CodesController();
router.get('/', ctrl.index.bind(ctrl));
router.get('/create', ctrl.showCreate.bind(ctrl));
router.post('/create', ctrl.create.bind(ctrl));
router.post('/:id/delete', ctrl.delete.bind(ctrl));
exports.default = router;
//# sourceMappingURL=codes.router.js.map