import { Request, Response } from 'express';
import { dbService } from '../../services/DatabaseService';
import { dnsEncrypt, generateRandomKey } from '../../services/EncryptionService';

export class DnsApiController {
  handle(req: Request, res: Response): void {
    const rows = dbService.select<{ name: string; url: string }>('dns', 'title AS name, url');
    const jsonString = JSON.stringify(rows, null, 2);

    const key1 = generateRandomKey(16);
    const encrypted = dnsEncrypt(jsonString, key1, key1);

    res.set('Content-Type', 'application/json; charset=UTF-8');
    res.send(encrypted);
  }
}
