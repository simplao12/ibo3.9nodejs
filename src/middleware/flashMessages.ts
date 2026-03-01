import { Request, Response, NextFunction } from 'express';

/**
 * Flash message middleware.
 * Replaces the PHP ?status=1/2/3/4 pattern with Bootstrap toast notifications.
 */
export function flashMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Expose flash messages to templates and clear them
  res.locals.flash = req.session.flash || [];
  req.session.flash = [];

  // Helper to add flash message
  res.flash = (type: string, message: string) => {
    if (!req.session.flash) req.session.flash = [];
    req.session.flash.push({ type, message });
  };

  next();
}

// Augment Express Response type
declare global {
  namespace Express {
    interface Response {
      flash: (type: string, message: string) => void;
    }
  }
}
