import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { dbService } from '../../services/DatabaseService';
import type { UserRow } from '../../types/models';

export class AuthController {
  showLogin(req: Request, res: Response): void {
    if (req.session?.loggedin) {
      res.redirect('/dns');
      return;
    }
    res.render('auth/login', {
      title: 'Login',
      error: null,
      timeout: req.query.timeout === '1',
      csrfToken: req.session.csrfToken || '',
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body as { username: string; password: string };

    if (!username || !password) {
      res.render('auth/login', {
        title: 'Login',
        error: 'Please fill in all fields.',
        timeout: false,
        csrfToken: req.session.csrfToken || '',
      });
      return;
    }

    const users = dbService.select<UserRow>('user', '*', 'username = $username', '', {
      $username: username,
    });

    if (!users.length) {
      res.render('auth/login', {
        title: 'Login',
        error: 'Invalid username or password.',
        timeout: false,
        csrfToken: req.session.csrfToken || '',
      });
      return;
    }

    const user = users[0];
    const isBcrypt = user.password.startsWith('$2b$') || user.password.startsWith('$2a$');

    const valid = isBcrypt
      ? await bcrypt.compare(password, user.password)
      : password === user.password;

    if (!valid) {
      res.render('auth/login', {
        title: 'Login',
        error: 'Invalid username or password.',
        timeout: false,
        csrfToken: req.session.csrfToken || '',
      });
      return;
    }

    // Upgrade plain-text password to bcrypt on first successful login
    if (!isBcrypt) {
      const hashed = await bcrypt.hash(password, 12);
      dbService.update('user', { password: hashed }, 'id = $id', { $id: user.id });
    }

    // Regenerate session to prevent fixation
    req.session.regenerate((err) => {
      if (err) {
        res.redirect('/login');
        return;
      }
      req.session.loggedin = true;
      req.session.name = user.username;
      req.session.LAST_ACTIVITY = Date.now();

      // First login as 'admin' goes to credentials page
      if (user.username === 'admin') {
        res.redirect('/account');
      } else {
        res.redirect('/dns');
      }
    });
  }

  logout(req: Request, res: Response): void {
    req.session.destroy(() => {
      res.clearCookie('ibo.sid');
      res.redirect('/login');
    });
  }
}
