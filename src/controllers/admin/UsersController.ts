import { Request, Response } from 'express';
import { dbService } from '../../services/DatabaseService';
import type { IboRow } from '../../types/models';

const RESULTS_PER_PAGE = 30;

export class UsersController {
  index(req: Request, res: Response): void {
    const page = parseInt(String(req.query.view || '1'), 10);
    const searchTerm = String(req.query.search || '');
    const offset = (page - 1) * RESULTS_PER_PAGE;

    let where = '';
    const params: Record<string, unknown> = {};

    if (searchTerm) {
      where = 'mac_address LIKE $search OR title LIKE $search';
      params.$search = `%${searchTerm}%`;
    }

    const countResult = dbService.selectWithCount('ibo', 'id', where, params);
    const total = countResult[0]?.total ?? 0;
    const totalPages = Math.ceil(total / RESULTS_PER_PAGE);

    const users = dbService.selectPaged<IboRow>('ibo', '*', where, params, RESULTS_PER_PAGE, offset);

    res.render('users/index', {
      title: 'MAC Users',
      users,
      page,
      totalPages,
      searchTerm,
      flash: res.locals.flash,
    });
  }

  showCreate(req: Request, res: Response): void {
    res.render('users/create', { title: 'Add New User', flash: [] });
  }

  create(req: Request, res: Response): void {
    const { mac_address, protection, title, url, username, password } = req.body as Record<string, string>;
    if (!mac_address || !title || !url || !username || !password) {
      res.flash('warning', 'Please fill in all required fields.');
      res.redirect('/users/create');
      return;
    }
    dbService.insert('ibo', { mac_address, protection: protection || '0', title, url, username, password });
    res.flash('success', 'User added successfully.');
    res.redirect('/users');
  }

  showEdit(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const user = dbService.getOne<IboRow>('ibo', 'id = $id', { $id: id });
    if (!user) {
      res.flash('danger', 'User not found.');
      res.redirect('/users');
      return;
    }
    res.render('users/edit', { title: 'Edit User', user, flash: [] });
  }

  update(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);
    const { mac_address, protection, title, url, username, password } = req.body as Record<string, string>;
    if (!mac_address || !title || !url || !username || !password) {
      res.flash('warning', 'Please fill in all required fields.');
      res.redirect(`/users/${id}/edit`);
      return;
    }
    dbService.update('ibo', { mac_address, protection: protection || '0', title, url, username, password }, 'id = $id', { $id: id });
    res.flash('success', 'User updated successfully.');
    res.redirect('/users');
  }

  delete(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);
    dbService.delete('ibo', 'id = $id', { $id: id });
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
      res.json({ success: true });
      return;
    }
    res.flash('danger', 'User deleted.');
    res.redirect('/users');
  }
}
