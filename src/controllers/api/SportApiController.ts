import { Request, Response } from 'express';
import axios from 'axios';

export class SportApiController {
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const response = await axios.get<string>('https://widget.tvsportguide.com', {
        timeout: 5000,
        responseType: 'text',
      });
      res.set('Content-Type', 'text/html');
      res.send(response.data);
    } catch {
      res.status(500).send('Failed to fetch sports widget');
    }
  }
}
