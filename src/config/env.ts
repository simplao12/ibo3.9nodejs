import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const env = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  SESSION_SECRET: requireEnv('SESSION_SECRET', 'fallback_secret_change_me'),
  DATABASE_PATH: process.env.DATABASE_PATH || './data/.db.db',
  TMDB_API_KEY: process.env.TMDB_API_KEY || '6b8e3eaa1a03ebb45642e9531d8a76d2',
  PANEL_NAME: process.env.PANEL_NAME || 'iBO Pro Player 3.9',
  BRAND_NAME: process.env.BRAND_NAME || 'iBO Pro Player 3.9',
  CONTACT_URL: process.env.CONTACT_URL || 'https://t.me/SaNoJRTX',
  isProd: process.env.NODE_ENV === 'production',
};
