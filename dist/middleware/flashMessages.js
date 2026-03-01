"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flashMiddleware = flashMiddleware;
/**
 * Flash message middleware.
 * Replaces the PHP ?status=1/2/3/4 pattern with Bootstrap toast notifications.
 */
function flashMiddleware(req, res, next) {
    // Expose flash messages to templates and clear them
    res.locals.flash = req.session.flash || [];
    req.session.flash = [];
    // Helper to add flash message
    res.flash = (type, message) => {
        if (!req.session.flash)
            req.session.flash = [];
        req.session.flash.push({ type, message });
    };
    next();
}
//# sourceMappingURL=flashMessages.js.map