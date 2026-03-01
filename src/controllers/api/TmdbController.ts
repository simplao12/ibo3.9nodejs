import { Request, Response } from 'express';
import axios from 'axios';
import { env } from '../../config/env';

export class TmdbController {
  async handle(req: Request, res: Response): Promise<void> {
    const allMovies: unknown[] = [];
    try {
      for (let page = 1; page <= 5; page++) {
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${env.TMDB_API_KEY}&language=en-US&page=${page}`;
        const response = await axios.get<{ results: unknown[] }>(url, { timeout: 5000 });
        if (response.data?.results) {
          allMovies.push(...response.data.results);
        }
      }
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(allMovies));
    } catch {
      res.status(500).json({ error: 'Failed to fetch movies' });
    }
  }
}
