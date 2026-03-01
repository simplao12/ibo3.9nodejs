import { Request, Response } from 'express';
import { dbService } from '../../services/DatabaseService';
import type { DnsRow } from '../../types/models';

export class DnsController {
  index(req: Request, res: Response): void {
    const rows = dbService.select<DnsRow>('dns', '*', '', 'id ASC');
    res.render('dns/index', {
      title: 'DNS Settings',
      rows,
      flash: res.locals.flash,
    });
  }

  showCreate(req: Request, res: Response): void {
    res.render('dns/create', { title: 'New DNS/User', flash: [] });
  }

  create(req: Request, res: Response): void {
    const { title, url } = req.body as { title: string; url: string };
    if (!title || !url) {
      res.flash('warning', 'Please fill in all fields.');
      res.redirect('/dns/create');
      return;
    }
    dbService.insert('dns', { title, url });
    res.flash('success', 'DNS entry added successfully.');
    res.redirect('/dns');
  }

  showEdit(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const row = dbService.getOne<DnsRow>('dns', 'id = $id', { $id: id });
    if (!row) {
      res.flash('danger', 'DNS entry not found.');
      res.redirect('/dns');
      return;
    }
    res.render('dns/edit', { title: 'Edit DNS/User', row, flash: [] });
  }

  update(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const { title, url } = req.body as { title: string; url: string };
    if (!title || !url) {
      res.flash('warning', 'Please fill in all fields.');
      res.redirect(`/dns/${id}/edit`);
      return;
    }
    dbService.update('dns', { title, url }, 'id = $id', { $id: id });
    res.flash('success', 'DNS entry updated successfully.');
    res.redirect('/dns');
  }

  delete(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);
    dbService.delete('dns', 'id = $id', { $id: id });
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
      res.json({ success: true });
      return;
    }
    res.flash('danger', 'DNS entry deleted.');
    res.redirect('/dns');
  }
}
