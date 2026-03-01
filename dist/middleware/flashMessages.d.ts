import { Request, Response, NextFunction } from 'express';
/**
 * Flash message middleware.
 * Replaces the PHP ?status=1/2/3/4 pattern with Bootstrap toast notifications.
 */
export declare function flashMiddleware(req: Request, res: Response, next: NextFunction): void;
declare global {
    namespace Express {
        interface Response {
            flash: (type: string, message: string) => void;
        }
    }
}
//# sourceMappingURL=flashMessages.d.ts.map