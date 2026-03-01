"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TmdbController = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../config/env");
class TmdbController {
    async handle(req, res) {
        const allMovies = [];
        try {
            for (let page = 1; page <= 5; page++) {
                const url = `https://api.themoviedb.org/3/movie/popular?api_key=${env_1.env.TMDB_API_KEY}&language=en-US&page=${page}`;
                const response = await axios_1.default.get(url, { timeout: 5000 });
                if (response.data?.results) {
                    allMovies.push(...response.data.results);
                }
            }
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(allMovies));
        }
        catch {
            res.status(500).json({ error: 'Failed to fetch movies' });
        }
    }
}
exports.TmdbController = TmdbController;
//# sourceMappingURL=TmdbController.js.map