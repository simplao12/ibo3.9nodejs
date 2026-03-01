import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { dbService } from '../../services/DatabaseService';
import type { UserRow } from '../../types/models';

export class AccountController {
  show(req: Request, res: Response): void {
    const user = dbService.getOne<UserRow>('user', 'id = 1');
    res.render('account/credentials', {
      title: 'Update Credentials',
      user,
      flash: res.locals.flash,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const { username, password, confirm_password } = req.body as Record<string, string>;
    if (!username || !password) {
      res.flash('warning', 'Please fill in all fields.');
      res.redirect('/account');
      return;
    }
    if (password !== confirm_password) {
      res.flash('warning', 'Passwords do not match.');
      res.redirect('/account');
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    dbService.update('user', { username, password: hashed }, 'id = 1');

    // Update session with new username
    req.session.name = username;
    res.flash('success', 'Credentials updated successfully.');
    res.redirect('/account');
  }
}
