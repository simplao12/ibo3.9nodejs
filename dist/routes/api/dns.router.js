"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DnsApiController_1 = require("../../controllers/api/DnsApiController");
const router = (0, express_1.Router)();
const ctrl = new DnsApiController_1.DnsApiController();
router.get('/', ctrl.handle.bind(ctrl));
exports.default = router;
//# sourceMappingURL=dns.router.js.map