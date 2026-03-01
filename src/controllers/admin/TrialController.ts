import { Request, Response } from 'express';
import { dbService } from '../../services/DatabaseService';
import type { TrialRow } from '../../types/models';

export class TrialController {
  index(req: Request, res: Response): void {
    const rows = dbService.select<TrialRow>('trial', '*', '', 'id ASC');
    res.render('trial/index', {
      title: 'Expiration Dates',
      rows,
      flash: res.locals.flash,
    });
  }

  showCreate(req: Request, res: Response): void {
    const mac = String(req.query.mac || '').toUpperCase();
    res.render('trial/create', { title: 'Setup Trial', mac, flash: [] });
  }

  create(req: Request, res: Response): void {
    const { mac_address, expire_date } = req.body as Record<string, string>;
    if (!mac_address || !expire_date) {
      res.flash('warning', 'Please fill in all fields.');
      res.redirect('/trial/create');
      return;
    }

    // Enforce one subscription per MAC address
    const existing = dbService.selectWithCount('trial', 'mac_address', 'mac_address = $mac', {
      $mac: mac_address,
    });
    if (existing[0]?.total > 0) {
      res.flash('warning', 'Only one subscription period can be added per MAC address. Edit existing entry to change it.');
      res.redirect('/trial/create');
      return;
    }

    dbService.insert('trial', { mac_address, expire_date });
    res.flash('success', 'Trial expiration date set.');
    res.redirect('/trial');
  }

  showEdit(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const row = dbService.getOne<TrialRow>('trial', 'id = $id', { $id: id });
    if (!row) {
      res.flash('danger', 'Trial entry not found.');
      res.redirect('/trial');
      return;
    }
    res.render('trial/edit', { title: 'Edit Trial', row, flash: [] });
  }

  update(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const { expire_date } = req.body as Record<string, string>;
    if (!expire_date) {
      res.flash('warning', 'Please provide an expiration date.');
      res.redirect(`/trial/${id}/edit`);
      return;
    }
    dbService.update('trial', { expire_date }, 'id = $id', { $id: id });
    res.flash('success', 'Expiration date updated.');
    res.redirect('/trial');
  }

  delete(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);
    dbService.delete('trial', 'id = $id', { $id: id });
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
      res.json({ success: true });
      return;
    }
    res.flash('danger', 'Trial entry deleted.');
    res.redirect('/trial');
  }
}
