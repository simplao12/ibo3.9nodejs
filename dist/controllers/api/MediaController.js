"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../config/env");
class MediaController {
    async handle(req, res) {
        const movieId = req.query.key;
        if (!movieId) {
            res.status(400).send('Movie ID not provided.');
            return;
        }
        try {
            const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${env_1.env.TMDB_API_KEY}`;
            const response = await axios_1.default.get(url, { timeout: 5000 });
            const imdbId = response.data?.imdb_id;
            if (imdbId) {
                res.redirect(`https://www.imdb.com/title/${imdbId}/mediaviewer/`);
            }
            else {
                res.send('IMDB not found for this movie.');
            }
        }
        catch {
            res.send('Failed to fetch movie details.');
        }
    }
}
exports.MediaController = MediaController;
//# sourceMappingURL=MediaController.js.map