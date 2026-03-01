"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderWithLayoutMiddleware = renderWithLayoutMiddleware;
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
/**
 * Middleware that adds a res.renderWithLayout helper.
 * Renders a view inside a layout file by injecting <%- body %>.
 */
function renderWithLayoutMiddleware(req, res, next) {
    res.renderWithLayout = (view, locals = {}, layout = 'layouts/main') => {
        const viewsDir = path_1.default.join(process.cwd(), 'views');
        const viewPath = path_1.default.join(viewsDir, view + '.ejs');
        const layoutPath = path_1.default.join(viewsDir, layout + '.ejs');
        const mergedLocals = { ...res.locals, ...locals };
        ejs_1.default.renderFile(viewPath, mergedLocals, {}, (err, bodyStr) => {
            if (err) {
                next(err);
                return;
            }
            const layoutLocals = { ...mergedLocals, body: bodyStr };
            ejs_1.default.renderFile(layoutPath, layoutLocals, {}, (err2, html) => {
                if (err2) {
                    next(err2);
                    return;
                }
                res.send(html);
            });
        });
    };
    next();
}
//# sourceMappingURL=renderWithLayout.js.map