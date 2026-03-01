"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TrialController_1 = require("../../controllers/admin/TrialController");
const router = (0, express_1.Router)();
const ctrl = new TrialController_1.TrialController();
router.get('/', ctrl.index.bind(ctrl));
router.get('/create', ctrl.showCreate.bind(ctrl));
router.post('/create', ctrl.create.bind(ctrl));
router.get('/:id/edit', ctrl.showEdit.bind(ctrl));
router.post('/:id/edit', ctrl.update.bind(ctrl));
router.post('/:id/delete', ctrl.delete.bind(ctrl));
exports.default = router;
//# sourceMappingURL=trial.router.js.map