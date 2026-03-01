import { Request, Response } from 'express';
import { db } from '../../config/database';
import { dnsEncrypt, generateRandomKey } from '../../services/EncryptionService';

export class DnsApiController {
  handle(req: Request, res: Response): void {
    const rows = db.prepare('SELECT title AS name, url FROM dns').all() as { name: string; url: string }[];
    const jsonString = JSON.stringify(rows, null, 2);

    const key1 = generateRandomKey(16);
    const encrypted = dnsEncrypt(jsonString, key1, key1);

    res.set('Content-Type', 'application/json; charset=UTF-8');
    res.send(encrypted);
  }
}
