import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import ejs from 'ejs';

/**
 * Middleware that adds a res.renderWithLayout helper.
 * Renders a view inside a layout file by injecting <%- body %>.
 */
export function renderWithLayoutMiddleware(req: Request, res: Response, next: NextFunction): void {
  res.renderWithLayout = (view: string, locals: Record<string, unknown> = {}, layout = 'layouts/main') => {
    const viewsDir = path.join(process.cwd(), 'views');
    const viewPath = path.join(viewsDir, view + '.ejs');
    const layoutPath = path.join(viewsDir, layout + '.ejs');

    const mergedLocals = { ...res.locals, ...locals };

    ejs.renderFile(viewPath, mergedLocals, {}, (err, bodyStr) => {
      if (err) {
        next(err);
        return;
      }
      const layoutLocals = { ...mergedLocals, body: bodyStr };
      ejs.renderFile(layoutPath, layoutLocals, {}, (err2, html) => {
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

// Augment Express Response type
declare global {
  namespace Express {
    interface Response {
      renderWithLayout: (view: string, locals?: Record<string, unknown>, layout?: string) => void;
    }
  }
}
