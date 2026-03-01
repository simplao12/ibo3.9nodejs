import { Request, Response } from 'express';
import { dbService } from '../../services/DatabaseService';
import type { LeaguesXRow, LeaguesTableRow } from '../../types/models';

const RESULTS_PER_PAGE = 10;

export class SportsController {
  // Sports Settings
  showSettings(req: Request, res: Response): void {
    const row = dbService.getOne('sports', 'id = 1') as {
      header_n: string; border_c: string; background_c: string; text_c: string; days: string; api: string;
    } | undefined;
    res.render('sports/settings', {
      title: 'Sports Settings',
      row: row || { header_n: '', border_c: '', background_c: '', text_c: '', days: '1', api: '' },
      flash: res.locals.flash,
    });
  }

  updateSettings(req: Request, res: Response): void {
    const { header_n, border_c, background_c, text_c, days, api } = req.body as Record<string, string>;
    const existing = dbService.getOne('sports', 'id = 1');
    if (existing) {
      dbService.update('sports', { header_n, border_c, background_c, text_c, days, api }, 'id = 1');
    } else {
      dbService.insert('sports', { id: 1, header_n, border_c, background_c, text_c, days, api });
    }
    res.flash('success', 'Sports settings updated.');
    res.redirect('/sports/settings');
  }

  // Leagues (leaguesx)
  indexLeagues(req: Request, res: Response): void {
    const page = parseInt(String(req.query.view || '1'), 10);
    const searchTerm = String(req.query.search || '');
    const offset = (page - 1) * RESULTS_PER_PAGE;

    let where = '';
    const params: Record<string, unknown> = {};
    if (searchTerm) {
      where = 'league LIKE $search';
      params.$search = `%${searchTerm}%`;
    }

    const total = dbService.selectWithCount('leaguesx', 'id', where, params)[0]?.total ?? 0;
    const totalPages = Math.ceil(total / RESULTS_PER_PAGE);
    const rows = dbService.selectPaged<LeaguesXRow>('leaguesx', '*', where, params, RESULTS_PER_PAGE, offset);

    res.render('sports/leagues', { title: 'League IDs', rows, page, totalPages, searchTerm, flash: res.locals.flash });
  }

  createLeague(req: Request, res: Response): void {
    const { league, leagueId } = req.body as Record<string, string>;
    if (!league || !leagueId) {
      res.flash('warning', 'Please fill in all fields.');
      res.redirect('/sports/leagues');
      return;
    }
    dbService.insert('leaguesx', { league, leagueId });
    res.flash('success', 'League ID added.');
    res.redirect('/sports/leagues');
  }

  deleteLeague(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);
    dbService.delete('leaguesx', 'id = $id', { $id: id });
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
      res.json({ success: true });
      return;
    }
    res.flash('danger', 'League deleted.');
    res.redirect('/sports/leagues');
  }

  // Leagues Table (leaguestable)
  indexLeaguesTable(req: Request, res: Response): void {
    const page = parseInt(String(req.query.view || '1'), 10);
    const searchTerm = String(req.query.search || '');
    const offset = (page - 1) * RESULTS_PER_PAGE;

    let where = '';
    const params: Record<string, unknown> = {};
    if (searchTerm) {
      where = 'league LIKE $search';
      params.$search = `%${searchTerm}%`;
    }

    const total = dbService.selectWithCount('leaguestable', 'id', where, params)[0]?.total ?? 0;
    const totalPages = Math.ceil(total / RESULTS_PER_PAGE);
    const rows = dbService.selectPaged<LeaguesTableRow>('leaguestable', '*', where, params, RESULTS_PER_PAGE, offset);

    res.render('sports/leagues-table', { title: 'League Widget IDs', rows, page, totalPages, searchTerm, flash: res.locals.flash });
  }

  createLeagueTable(req: Request, res: Response): void {
    const { league, leagueId } = req.body as Record<string, string>;
    if (!league || !leagueId) {
      res.flash('warning', 'Please fill in all fields.');
      res.redirect('/sports/leagues-table');
      return;
    }
    dbService.insert('leaguestable', { league, leagueId });
    res.flash('success', 'League widget ID added.');
    res.redirect('/sports/leagues-table');
  }

  deleteLeagueTable(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);
    dbService.delete('leaguestable', 'id = $id', { $id: id });
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
      res.json({ success: true });
      return;
    }
    res.flash('danger', 'League widget deleted.');
    res.redirect('/sports/leagues-table');
  }
}
