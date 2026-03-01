import { Request, Response } from 'express';
import axios from 'axios';
import { env } from '../../config/env';

export class MediaController {
  async handle(req: Request, res: Response): Promise<void> {
    const movieId = req.query.key as string;
    if (!movieId) {
      res.status(400).send('Movie ID not provided.');
      return;
    }

    try {
      const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${env.TMDB_API_KEY}`;
      const response = await axios.get<{ imdb_id?: string }>(url, { timeout: 5000 });
      const imdbId = response.data?.imdb_id;
      if (imdbId) {
        res.redirect(`https://www.imdb.com/title/${imdbId}/mediaviewer/`);
      } else {
        res.send('IMDB not found for this movie.');
      }
    } catch {
      res.send('Failed to fetch movie details.');
    }
  }
}
