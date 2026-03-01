import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';

import { env } from './config/env';
import { flashMiddleware } from './middleware/flashMessages';
import { csrfMiddleware } from './middleware/csrf';
import router from './routes/index';

const app = express();

// Security headers (relaxed for EJS + CDN assets)
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow CDN scripts/styles
    crossOriginEmbedderPolicy: false,
  })
);

// Request logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'ibo.sid',
    cookie: {
      httpOnly: true,
      secure: env.isProd,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    },
  })
);

// Flash messages (must be after session)
app.use(flashMiddleware);

// EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// Static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Global res.locals for all templates
app.use((req, res, next) => {
  res.locals.panelName = env.PANEL_NAME;
  res.locals.brandName = env.BRAND_NAME;
  res.locals.contactUrl = env.CONTACT_URL;
  res.locals.currentPath = req.path;
  res.locals.loggedInUser = req.session?.name || '';
  next();
});

// Routes (includes CSRF for admin routes)
app.use(router);

// 404 handler
app.use((req, res) => {
  res.status(404).render('auth/login', {
    error: 'Page not found.',
    title: '404',
  });
});

export default app;
