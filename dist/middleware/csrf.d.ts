import { Request, Response, NextFunction } from 'express';
/**
 * Simple CSRF protection using session tokens.
 * Generates a token and validates it on unsafe methods (POST, PUT, DELETE, PATCH).
 */
export declare function csrfMiddleware(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=csrf.d.ts.map