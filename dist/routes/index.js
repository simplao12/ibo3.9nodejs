"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const csrf_1 = require("../middleware/csrf");
// Admin routers
const auth_router_1 = __importDefault(require("./admin/auth.router"));
const dns_router_1 = __importDefault(require("./admin/dns.router"));
const users_router_1 = __importDefault(require("./admin/users.router"));
const codes_router_1 = __importDefault(require("./admin/codes.router"));
const trial_router_1 = __importDefault(require("./admin/trial.router"));
const account_router_1 = __importDefault(require("./admin/account.router"));
const settings_router_1 = __importDefault(require("./admin/settings.router"));
const themes_router_1 = __importDefault(require("./admin/themes.router"));
const ads_router_1 = __importDefault(require("./admin/ads.router"));
const sports_router_1 = __importDefault(require("./admin/sports.router"));
// API routers (public, no CSRF)
const appuser_router_1 = __importDefault(require("./api/appuser.router"));
const auth_router_2 = __importDefault(require("./api/auth.router"));
const code_router_1 = __importDefault(require("./api/code.router"));
const savedata_router_1 = __importDefault(require("./api/savedata.router"));
const media_router_1 = __importDefault(require("./api/media.router"));
const tmdb_router_1 = __importDefault(require("./api/tmdb.router"));
const dns_router_2 = __importDefault(require("./api/dns.router"));
const sport_router_1 = __importDefault(require("./api/sport.router"));
const router = (0, express_1.Router)();
// ─── Root redirect ─────────────────────────────────────────────────────────
router.get('/', auth_1.requireAuth, (req, res) => res.redirect('/dns'));
// ─── Admin auth (no requireAuth, but needs CSRF for token generation) ────────
router.use('/login', csrf_1.csrfMiddleware, auth_router_1.default);
router.get('/logout', (req, res) => res.redirect('/login/logout'));
// ─── Protected admin routes ────────────────────────────────────────────────
router.use('/dns', auth_1.requireAuth, csrf_1.csrfMiddleware, dns_router_1.default);
router.use('/users', auth_1.requireAuth, csrf_1.csrfMiddleware, users_router_1.default);
router.use('/codes', auth_1.requireAuth, csrf_1.csrfMiddleware, codes_router_1.default);
router.use('/trial', auth_1.requireAuth, csrf_1.csrfMiddleware, trial_router_1.default);
router.use('/account', auth_1.requireAuth, csrf_1.csrfMiddleware, account_router_1.default);
router.use('/settings', auth_1.requireAuth, csrf_1.csrfMiddleware, settings_router_1.default);
router.use('/themes', auth_1.requireAuth, csrf_1.csrfMiddleware, themes_router_1.default);
router.use('/ads', auth_1.requireAuth, csrf_1.csrfMiddleware, ads_router_1.default);
router.use('/sports', auth_1.requireAuth, csrf_1.csrfMiddleware, sports_router_1.default);
// ─── Legacy PHP URL redirects ──────────────────────────────────────────────
router.get('/main.php', auth_1.requireAuth, (req, res) => res.redirect('/dns'));
router.get('/mac_users.php', auth_1.requireAuth, (req, res) => res.redirect('/users'));
router.get('/users_create.php', auth_1.requireAuth, (req, res) => res.redirect('/users/create'));
router.get('/users_edite.php', auth_1.requireAuth, (req, res) => res.redirect('/users'));
router.get('/activation_code.php', auth_1.requireAuth, (req, res) => res.redirect('/codes'));
router.get('/code_create.php', auth_1.requireAuth, (req, res) => res.redirect('/codes/create'));
router.get('/setup_trial.php', auth_1.requireAuth, (req, res) => res.redirect('/trial'));
router.get('/themes.php', auth_1.requireAuth, (req, res) => res.redirect('/themes'));
router.get('/themes_login.php', auth_1.requireAuth, (req, res) => res.redirect('/settings/login-theme'));
router.get('/login_text.php', auth_1.requireAuth, (req, res) => res.redirect('/settings/login-text'));
router.get('/demo.php', auth_1.requireAuth, (req, res) => res.redirect('/settings/demo'));
router.get('/note.php', auth_1.requireAuth, (req, res) => res.redirect('/settings/notification'));
router.get('/mac_lenth.php', auth_1.requireAuth, (req, res) => res.redirect('/settings/mac-length'));
router.get('/update.php', auth_1.requireAuth, (req, res) => res.redirect('/settings/update'));
router.get('/license_key.php', auth_1.requireAuth, (req, res) => res.redirect('/settings/license'));
router.get('/user.php', auth_1.requireAuth, (req, res) => res.redirect('/account'));
router.get('/ads_settings.php', auth_1.requireAuth, (req, res) => res.redirect('/ads/type'));
router.get('/auto_layout.php', auth_1.requireAuth, (req, res) => res.redirect('/ads/auto-layout'));
router.get('/frame_layout.php', auth_1.requireAuth, (req, res) => res.redirect('/ads/frame-layout'));
router.get('/menads.php', auth_1.requireAuth, (req, res) => res.redirect('/ads/manual'));
router.get('/leagues.php', auth_1.requireAuth, (req, res) => res.redirect('/sports/leagues'));
router.get('/leagues_table.php', auth_1.requireAuth, (req, res) => res.redirect('/sports/leagues-table'));
router.get('/sports.php', auth_1.requireAuth, (req, res) => res.redirect('/sports/settings'));
router.get('/index.php', (req, res) => res.redirect('/login'));
// ─── Mobile App API routes (exact same URLs as PHP) ───────────────────────
router.use('/api/Getappuser.php', appuser_router_1.default);
router.use('/api/index.php', auth_router_2.default);
router.use('/api/getdatacode.php', code_router_1.default);
router.use('/api/savedata.php', savedata_router_1.default);
router.use('/api/media.php', media_router_1.default);
router.use('/api/TMDB.php', tmdb_router_1.default);
router.use('/api/dns.php', dns_router_2.default);
router.use('/api/sport.php', sport_router_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map