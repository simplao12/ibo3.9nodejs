import { Request, Response } from 'express';
import { dbService } from '../../services/DatabaseService';
import type { MenuAdsRow } from '../../types/models';

export class AdsController {
  // Ads Type
  showType(req: Request, res: Response): void {
    const row = dbService.getOne('adssettings', 'id = 1') as { adstype: string } | undefined;
    res.render('ads/type', { title: 'Ads Type', row: row || { adstype: '0' }, flash: res.locals.flash });
  }

  updateType(req: Request, res: Response): void {
    const { adstype } = req.body as Record<string, string>;
    const existing = dbService.getOne('adssettings', 'id = 1');
    if (existing) {
      dbService.update('adssettings', { adstype }, 'id = 1');
    } else {
      dbService.insert('adssettings', { id: 1, adstype });
    }
    res.flash('success', 'Ads type updated.');
    res.redirect('/ads/type');
  }

  // Auto Ads Layout
  showAutoLayout(req: Request, res: Response): void {
    const row = dbService.getOne('autolayout', 'id = 1') as { layout: string } | undefined;
    res.render('ads/auto-layout', { title: 'Auto Ads Layout', row: row || { layout: '0' }, flash: res.locals.flash });
  }

  updateAutoLayout(req: Request, res: Response): void {
    const { layout } = req.body as Record<string, string>;
    const existing = dbService.getOne('autolayout', 'id = 1');
    if (existing) {
      dbService.update('autolayout', { layout }, 'id = 1');
    } else {
      dbService.insert('autolayout', { id: 1, layout });
    }
    res.flash('success', 'Auto ads layout updated.');
    res.redirect('/ads/auto-layout');
  }

  // Frame Ads Layout
  showFrameLayout(req: Request, res: Response): void {
    const row = dbService.getOne('framelayout', 'id = 1') as { layout: string } | undefined;
    res.render('ads/frame-layout', { title: 'Frame Ads Layout', row: row || { layout: '0' }, flash: res.locals.flash });
  }

  updateFrameLayout(req: Request, res: Response): void {
    const { layout } = req.body as Record<string, string>;
    const existing = dbService.getOne('framelayout', 'id = 1');
    if (existing) {
      dbService.update('framelayout', { layout }, 'id = 1');
    } else {
      dbService.insert('framelayout', { id: 1, layout });
    }
    res.flash('success', 'Frame ads layout updated.');
    res.redirect('/ads/frame-layout');
  }

  // Manual Ads
  indexManual(req: Request, res: Response): void {
    const rows = dbService.select<MenuAdsRow>('menuads', '*', '', 'id ASC');
    res.render('ads/manual/index', { title: 'Manual Ads', rows, flash: res.locals.flash });
  }

  showCreateManual(req: Request, res: Response): void {
    res.render('ads/manual/create', { title: 'Create Manual Ad', flash: [] });
  }

  createManual(req: Request, res: Response): void {
    const { title, url } = req.body as Record<string, string>;
    if (!title || !url) {
      res.flash('warning', 'Please fill in all fields.');
      res.redirect('/ads/manual/create');
      return;
    }
    dbService.insert('menuads', { title, url });
    res.flash('success', 'Manual ad created.');
    res.redirect('/ads/manual');
  }

  showEditManual(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const row = dbService.getOne<MenuAdsRow>('menuads', 'id = $id', { $id: id });
    if (!row) {
      res.flash('danger', 'Ad not found.');
      res.redirect('/ads/manual');
      return;
    }
    res.render('ads/manual/edit', { title: 'Edit Manual Ad', row, flash: [] });
  }

  updateManual(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const { title, url } = req.body as Record<string, string>;
    if (!title || !url) {
      res.flash('warning', 'Please fill in all fields.');
      res.redirect(`/ads/manual/${id}/edit`);
      return;
    }
    dbService.update('menuads', { title, url }, 'id = $id', { $id: id });
    res.flash('success', 'Ad updated.');
    res.redirect('/ads/manual');
  }

  deleteManual(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);
    dbService.delete('menuads', 'id = $id', { $id: id });
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
      res.json({ success: true });
      return;
    }
    res.flash('danger', 'Ad deleted.');
    res.redirect('/ads/manual');
  }
}
