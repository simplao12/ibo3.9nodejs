"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AccountController_1 = require("../../controllers/admin/AccountController");
const router = (0, express_1.Router)();
const ctrl = new AccountController_1.AccountController();
router.get('/', ctrl.show.bind(ctrl));
router.post('/', ctrl.update.bind(ctrl));
exports.default = router;
//# sourceMappingURL=account.router.js.map