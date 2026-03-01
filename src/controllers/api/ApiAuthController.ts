import { Request, Response } from 'express';
import { dbService } from '../../services/DatabaseService';
import { simpleEncrypt } from '../../services/EncryptionService';
import { callLink } from '../../services/HttpService';

function outEcho(res: Response, status: 1 | 2): void {
  const data =
    status === 1
      ? { status: 'success', data: 'Login successful.' }
      : { status: 'unsuccess', data: 'Invalid username/password or account has expired.' };
  const final = simpleEncrypt(JSON.stringify(data));
  res.set('Content-Type', 'application/json; charset=UTF-8');
  res.json({ peterparker: final });
}

export class ApiAuthController {
  async handle(req: Request, res: Response): Promise<void> {
    const { username, password } = req.query as { username?: string; password?: string };

    if (!username || !password) {
      outEcho(res, 2);
      return;
    }

    // Check panel (menualuser) first
    const panelUsers = dbService.select<{
      id: number; username: string; password: string; expire_date: string;
    }>('menualuser', '*', 'username = $username', '', { $username: username });

    if (panelUsers.length > 0) {
      const pu = panelUsers[0];
      const expiredTs = pu.expire_date ? Date.now() > new Date(pu.expire_date).getTime() : true;
      if (!expiredTs && pu.username === username && pu.password === password) {
        outEcho(res, 1);
        return;
      }
    }

    // Check DNS servers
    const dnsRows = dbService.select<{ url: string }>('dns', '*');
    let found = false;

    for (const row of dnsRows) {
      const apiLink = `${row.url}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
      const result = await callLink(apiLink);
      if (result.result === 'success') {
        const data = result.data as { user_info?: { auth?: number; status?: string } };
        if (data?.user_info?.auth && data.user_info.auth !== 0 && data.user_info.status === 'Active') {
          outEcho(res, 1);
          found = true;
          break;
        }
      }
    }

    if (!found) {
      outEcho(res, 2);
    }
  }
}
