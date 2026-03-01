"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TmdbController_1 = require("../../controllers/api/TmdbController");
const router = (0, express_1.Router)();
const ctrl = new TmdbController_1.TmdbController();
router.get('/', ctrl.handle.bind(ctrl));
exports.default = router;
//# sourceMappingURL=tmdb.router.js.map