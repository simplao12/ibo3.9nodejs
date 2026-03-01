import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { csrfMiddleware } from '../middleware/csrf';

// Admin routers
import authRouter from './admin/auth.router';
import dnsRouter from './admin/dns.router';
import usersRouter from './admin/users.router';
import codesRouter from './admin/codes.router';
import trialRouter from './admin/trial.router';
import accountRouter from './admin/account.router';
import settingsRouter from './admin/settings.router';
import themesRouter from './admin/themes.router';
import adsRouter from './admin/ads.router';
import sportsRouter from './admin/sports.router';

// API routers (public, no CSRF)
import appUserApiRouter from './api/appuser.router';
import authApiRouter from './api/auth.router';
import codeApiRouter from './api/code.router';
import savedataApiRouter from './api/savedata.router';
import mediaApiRouter from './api/media.router';
import tmdbApiRouter from './api/tmdb.router';
import dnsApiRouter from './api/dns.router';
import sportApiRouter from './api/sport.router';

const router = Router();

// ─── Root redirect ─────────────────────────────────────────────────────────
router.get('/', requireAuth, (req, res) => res.redirect('/dns'));

// ─── Admin auth (no requireAuth, but needs CSRF for token generation) ────────
router.use('/login', csrfMiddleware, authRouter);
router.get('/logout', (req, res) => res.redirect('/login/logout'));

// ─── Protected admin routes ────────────────────────────────────────────────
router.use('/dns', requireAuth, csrfMiddleware, dnsRouter);
router.use('/users', requireAuth, csrfMiddleware, usersRouter);
router.use('/codes', requireAuth, csrfMiddleware, codesRouter);
router.use('/trial', requireAuth, csrfMiddleware, trialRouter);
router.use('/account', requireAuth, csrfMiddleware, accountRouter);
router.use('/settings', requireAuth, csrfMiddleware, settingsRouter);
router.use('/themes', requireAuth, csrfMiddleware, themesRouter);
router.use('/ads', requireAuth, csrfMiddleware, adsRouter);
router.use('/sports', requireAuth, csrfMiddleware, sportsRouter);

// ─── Legacy PHP URL redirects ──────────────────────────────────────────────
router.get('/main.php', requireAuth, (req, res) => res.redirect('/dns'));
router.get('/mac_users.php', requireAuth, (req, res) => res.redirect('/users'));
router.get('/users_create.php', requireAuth, (req, res) => res.redirect('/users/create'));
router.get('/users_edite.php', requireAuth, (req, res) => res.redirect('/users'));
router.get('/activation_code.php', requireAuth, (req, res) => res.redirect('/codes'));
router.get('/code_create.php', requireAuth, (req, res) => res.redirect('/codes/create'));
router.get('/setup_trial.php', requireAuth, (req, res) => res.redirect('/trial'));
router.get('/themes.php', requireAuth, (req, res) => res.redirect('/themes'));
router.get('/themes_login.php', requireAuth, (req, res) => res.redirect('/settings/login-theme'));
router.get('/login_text.php', requireAuth, (req, res) => res.redirect('/settings/login-text'));
router.get('/demo.php', requireAuth, (req, res) => res.redirect('/settings/demo'));
router.get('/note.php', requireAuth, (req, res) => res.redirect('/settings/notification'));
router.get('/mac_lenth.php', requireAuth, (req, res) => res.redirect('/settings/mac-length'));
router.get('/update.php', requireAuth, (req, res) => res.redirect('/settings/update'));
router.get('/license_key.php', requireAuth, (req, res) => res.redirect('/settings/license'));
router.get('/user.php', requireAuth, (req, res) => res.redirect('/account'));
router.get('/ads_settings.php', requireAuth, (req, res) => res.redirect('/ads/type'));
router.get('/auto_layout.php', requireAuth, (req, res) => res.redirect('/ads/auto-layout'));
router.get('/frame_layout.php', requireAuth, (req, res) => res.redirect('/ads/frame-layout'));
router.get('/menads.php', requireAuth, (req, res) => res.redirect('/ads/manual'));
router.get('/leagues.php', requireAuth, (req, res) => res.redirect('/sports/leagues'));
router.get('/leagues_table.php', requireAuth, (req, res) => res.redirect('/sports/leagues-table'));
router.get('/sports.php', requireAuth, (req, res) => res.redirect('/sports/settings'));
router.get('/index.php', (req, res) => res.redirect('/login'));

// ─── Mobile App API routes (exact same URLs as PHP) ───────────────────────
router.use('/api/Getappuser.php', appUserApiRouter);
router.use('/api/index.php', authApiRouter);
router.use('/api/getdatacode.php', codeApiRouter);
router.use('/api/savedata.php', savedataApiRouter);
router.use('/api/media.php', mediaApiRouter);
router.use('/api/TMDB.php', tmdbApiRouter);
router.use('/api/dns.php', dnsApiRouter);
router.use('/api/sport.php', sportApiRouter);

export default router;
