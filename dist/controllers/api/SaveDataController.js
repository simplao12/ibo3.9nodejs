"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveDataController = void 0;
const DatabaseService_1 = require("../../services/DatabaseService");
const PLAYLIST_NAMES = [
    'Ultimate Entertainment 🔐', 'Global TV Hub 🔐', 'Prime Streaming Zone 🔐',
    'All-in-One IPTV Lounge 🔐', 'HD Channel Showcase 🔐', 'Sports Mania 🔐',
    'Movie Magic 🔐', 'News Network Central 🔐', 'Kids Fun Zone 🔐',
    'Lifestyle Paradise 🔐', 'Documentary Delight 🔐', 'Music Melodies 🔐',
    'Comedy Central 🔐', 'Reality TV Extravaganza 🔐', "Traveler's Guide 🔐",
    'Sci-Fi Spectacle 🔐', 'Health and Fitness Channel 🔐', 'Gaming Galaxy 🔐',
    'Fashion Forward 🔐', 'Business Buzz 🔐', 'Foodie Haven 🔐',
    'Educational Excellence 🔐', 'Thriller Theater 🔐', 'History Channel Vault 🔐',
    'Cartoons Unlimited 🔐', 'Tech Titans 🔐', 'Wildlife Adventure 🔐',
    'Artistic Expressions 🔐', 'Supernatural Secrets 🔐', 'Retro Rewind 🔐',
    'Romance Reels 🔐', 'Spiritual Serenity 🔐', 'DIY Network 🔐',
    "Car Enthusiast's Paradise 🔐", 'Action Packed 🔐', 'True Crime Stories 🔐',
    'International Flavor 🔐', "Nature's Wonders 🔐", 'Home Makeover Madness 🔐',
    'Anime Haven 🔐', 'Pop Culture Playground 🔐', 'Hidden Gems 🔐',
    'Blockbuster Bonanza 🔐', 'Motivational Mojo 🔐', 'Vintage Vibes 🔐',
    'Outdoor Expeditions 🔐', 'Social Media Stars 🔐', 'Celebrity Showcase 🔐',
    'Science and Technology Marvels 🔐', 'Fitness Freaks 🔐',
];
function pickName(pname) {
    if (!pname || pname === 'noname') {
        return PLAYLIST_NAMES[Math.floor(Math.random() * PLAYLIST_NAMES.length)];
    }
    return pname + ' 🔐';
}
class SaveDataController {
    handle(req, res) {
        const { mac_address, username, password, dns, pname } = req.query;
        if (!mac_address || !username || !password || !dns) {
            res.json({ status: 'unsuccess', listname: 'Something is wrong' });
            return;
        }
        const randomPlaylistName = pickName(pname);
        try {
            DatabaseService_1.dbService.insert('ibo', {
                mac_address,
                username,
                password,
                protection: '0',
                url: dns,
                title: randomPlaylistName,
            });
            res.json({ status: 'success', listname: randomPlaylistName });
        }
        catch (err) {
            res.json({ status: 'unsuccess', listname: String(err) });
        }
    }
}
exports.SaveDataController = SaveDataController;
//# sourceMappingURL=SaveDataController.js.map