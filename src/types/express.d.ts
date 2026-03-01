import 'express-session';

declare module 'express-session' {
  interface SessionData {
    loggedin: boolean;
    name: string;
    LAST_ACTIVITY: number;
    flash: Array<{ type: string; message: string }>;
    csrfToken: string;
  }
}
