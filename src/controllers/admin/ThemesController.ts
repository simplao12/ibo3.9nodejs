import { Request, Response } from 'express';
import { dbService } from '../../services/DatabaseService';

const THEMES = Array.from({ length: 17 }, (_, i) => `theme_${i + 1}`);

export class ThemesController {
  index(req: Request, res: Response): void {
    const row = dbService.getOne('theme', 'id = 1') as { theme_no: string } | undefined;
    res.render('themes/index', {
      title: 'App Themes',
      currentTheme: row?.theme_no || 'theme_0',
      themes: THEMES,
      flash: res.locals.flash,
    });
  }

  update(req: Request, res: Response): void {
    const { theme_no } = req.body as { theme_no: string };
    const existing = dbService.getOne('theme', 'id = 1');
    if (existing) {
      dbService.update('theme', { theme_no }, 'id = 1');
    } else {
      dbService.insert('theme', { id: 1, theme_no });
    }
    res.flash('success', `Theme set to ${theme_no}.`);
    res.redirect('/themes');
  }
}
