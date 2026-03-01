"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csrfMiddleware = csrfMiddleware;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Simple CSRF protection using session tokens.
 * Generates a token and validates it on unsafe methods (POST, PUT, DELETE, PATCH).
 */
function csrfMiddleware(req, res, next) {
    // Generate token if not present
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto_1.default.randomBytes(32).toString('hex');
    }
    // Make token available in all EJS templates
    res.locals.csrfToken = req.session.csrfToken;
    // Validate on unsafe methods
    const unsafeMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
    if (unsafeMethods.includes(req.method)) {
        const token = req.body._csrf ||
            req.headers['x-csrf-token'];
        if (!token || token !== req.session.csrfToken) {
            res.status(403).send('CSRF token mismatch. Please refresh the page and try again.');
            return;
        }
    }
    next();
}
//# sourceMappingURL=csrf.js.map