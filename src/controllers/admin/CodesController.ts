import { Request, Response } from 'express';
import { dbService } from '../../services/DatabaseService';
import type { IboCodeRow } from '../../types/models';

const RESULTS_PER_PAGE = 10;

export class CodesController {
  index(req: Request, res: Response): void {
    const page = parseInt(String(req.query.view || '1'), 10);
    const searchTerm = String(req.query.search || '');
    const offset = (page - 1) * RESULTS_PER_PAGE;

    let where = '';
    const params: Record<string, unknown> = {};

    if (searchTerm) {
      where = 'ac_code LIKE $search';
      params.$search = `%${searchTerm}%`;
    }

    const countResult = dbService.selectWithCount('ibocode', 'id', where, params);
    const total = countResult[0]?.total ?? 0;
    const totalPages = Math.ceil(total / RESULTS_PER_PAGE);

    const codes = dbService.selectPaged<IboCodeRow>('ibocode', '*', where, params, RESULTS_PER_PAGE, offset);

    res.render('codes/index', {
      title: 'Activation Codes',
      codes,
      page,
      totalPages,
      searchTerm,
      flash: res.locals.flash,
    });
  }

  showCreate(req: Request, res: Response): void {
    // Auto-generate code (timestamp based, 8 digits) - port of PHP code_create.php
    const autoCode = String(Date.now()).slice(-8);
    res.render('codes/create', { title: 'Create Activation Code', autoCode, flash: [] });
  }

  create(req: Request, res: Response): void {
    const { ac_code, url, username, password } = req.body as Record<string, string>;
    if (!ac_code || !url || !username || !password) {
      res.flash('warning', 'Please fill in all required fields.');
      res.redirect('/codes/create');
      return;
    }
    dbService.insert('ibocode', { ac_code, url, username, password, status: 'NotUsed' });
    res.flash('success', 'Activation code created.');
    res.redirect('/codes');
  }

  delete(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);
    dbService.delete('ibocode', 'id = $id', { $id: id });
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
      res.json({ success: true });
      return;
    }
    res.flash('danger', 'Activation code deleted.');
    res.redirect('/codes');
  }
}
