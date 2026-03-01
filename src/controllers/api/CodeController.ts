import { Request, Response } from 'express';
import { dbService } from '../../services/DatabaseService';
import type { IboCodeRow } from '../../types/models';

export class CodeController {
  handle(req: Request, res: Response): void {
    const accode = String(req.query.accode || '');

    res.set('Content-Type', 'application/json; charset=UTF-8');

    if (!accode) {
      res.json({ status: 'unsuccess', dns: 'Invalid username/password or account has expired.' });
      return;
    }

    const rows = dbService.select<IboCodeRow>('ibocode', '*', 'ac_code = $code', '', { $code: accode });

    if (!rows.length || rows[0].ac_code !== accode) {
      res.json({ status: 'unsuccess', dns: 'Invalid username/password or account has expired.' });
      return;
    }

    const row = rows[0];

    if (row.status === 'USED' || !row.status) {
      res.json({ status: 'unsuccess', dns: 'This code has already been used' });
      return;
    }

    // Mark as used
    dbService.update('ibocode', { status: 'USED' }, 'ac_code = $code', { $code: accode });

    res.json({
      status: 'success',
      dns: row.url,
      username: row.username,
      password: row.password,
    });
  }
}
