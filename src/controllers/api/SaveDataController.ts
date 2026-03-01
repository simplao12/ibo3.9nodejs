import { Request, Response } from 'express';
import { db } from '../../config/database';

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

function pickName(pname: string): string {
  if (!pname || pname === 'noname') {
    return PLAYLIST_NAMES[Math.floor(Math.random() * PLAYLIST_NAMES.length)];
  }
  return pname + ' 🔐';
}

export class SaveDataController {
  handle(req: Request, res: Response): void {
    const { mac_address, username, password, dns, pname } = req.query as Record<string, string>;

    if (!mac_address || !username || !password || !dns) {
      res.json({ status: 'unsuccess', listname: 'Something is wrong' });
      return;
    }

    const randomPlaylistName = pickName(pname);

    try {
      db.prepare(
        'INSERT INTO ibo(mac_address, username, password, protection, url, title) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(mac_address, username, password, '0', dns, randomPlaylistName);

      res.json({ status: 'success', listname: randomPlaylistName });
    } catch (err) {
      res.json({ status: 'unsuccess', listname: String(err) });
    }
  }
}
