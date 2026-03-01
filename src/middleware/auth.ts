import { Request, Response, NextFunction } from 'express';

const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.loggedin) {
    res.redirect('/login');
    return;
  }

  const lastActivity = req.session.LAST_ACTIVITY;
  if (lastActivity && Date.now() - lastActivity > TIMEOUT_MS) {
    req.session.destroy(() => {
      res.redirect('/login?timeout=1');
    });
    return;
  }

  req.session.LAST_ACTIVITY = Date.now();
  next();
}
