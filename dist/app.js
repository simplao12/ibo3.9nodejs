"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const flashMessages_1 = require("./middleware/flashMessages");
const index_1 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
// Security headers (relaxed for EJS + CDN assets)
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // Allow CDN scripts/styles
    crossOriginEmbedderPolicy: false,
}));
// Request logging
if (env_1.env.NODE_ENV !== 'test') {
    app.use((0, morgan_1.default)('dev'));
}
// Body parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Session
// In production we may be behind a proxy (Heroku, etc), tell Express to trust it so
// that req.secure is correctly populated and cookies marked `secure` will work.
app.set('trust proxy', 1);
app.use((0, express_session_1.default)({
    secret: env_1.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'ibo.sid',
    cookie: {
        httpOnly: true,
        // only set secure flag when clearly running over HTTPS; the deploy host may
        // have NODE_ENV=production but not actually serve HTTPS, so allow override
        // via an env var or by checking req.secure via trust proxy above.
        secure: env_1.env.isProd && process.env.FORCE_SECURE === 'true',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
    },
}));
// Flash messages (must be after session)
app.use(flashMessages_1.flashMiddleware);
// EJS view engine
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, '..', 'views'));
// Static files
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
// Global res.locals for all templates
app.use((req, res, next) => {
    res.locals.panelName = env_1.env.PANEL_NAME;
    res.locals.brandName = env_1.env.BRAND_NAME;
    res.locals.contactUrl = env_1.env.CONTACT_URL;
    res.locals.currentPath = req.path;
    res.locals.loggedInUser = req.session?.name || '';
    next();
});
// Routes (includes CSRF for admin routes)
app.use(index_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).render('auth/login', {
        error: 'Page not found.',
        title: '404',
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map