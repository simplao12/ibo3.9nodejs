"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsersController_1 = require("../../controllers/admin/UsersController");
const router = (0, express_1.Router)();
const ctrl = new UsersController_1.UsersController();
router.get('/', ctrl.index.bind(ctrl));
router.get('/create', ctrl.showCreate.bind(ctrl));
router.post('/create', ctrl.create.bind(ctrl));
router.get('/:id/edit', ctrl.showEdit.bind(ctrl));
router.post('/:id/edit', ctrl.update.bind(ctrl));
router.post('/:id/delete', ctrl.delete.bind(ctrl));
exports.default = router;
//# sourceMappingURL=users.router.js.map