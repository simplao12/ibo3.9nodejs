import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * Simple CSRF protection using session tokens.
 * Generates a token and validates it on unsafe methods (POST, PUT, DELETE, PATCH).
 */

export function csrfMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Generate token if not present
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }

  // Make token available in all EJS templates
  res.locals.csrfToken = req.session.csrfToken;

  // Validate on unsafe methods
  const unsafeMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  if (unsafeMethods.includes(req.method)) {
    const token =
      (req.body as Record<string, string>)._csrf ||
      req.headers['x-csrf-token'] as string;

    if (!token || token !== req.session.csrfToken) {
      res.status(403).send('CSRF token mismatch. Please refresh the page and try again.');
      return;
    }
  }

  next();
}
