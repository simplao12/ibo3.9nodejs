import { Request, Response, NextFunction } from 'express';
/**
 * Middleware that adds a res.renderWithLayout helper.
 * Renders a view inside a layout file by injecting <%- body %>.
 */
export declare function renderWithLayoutMiddleware(req: Request, res: Response, next: NextFunction): void;
declare global {
    namespace Express {
        interface Response {
            renderWithLayout: (view: string, locals?: Record<string, unknown>, layout?: string) => void;
        }
    }
}
//# sourceMappingURL=renderWithLayout.d.ts.map