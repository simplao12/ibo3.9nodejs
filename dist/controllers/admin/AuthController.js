"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const DatabaseService_1 = require("../../services/DatabaseService");
class AuthController {
    showLogin(req, res) {
        if (req.session?.loggedin) {
            res.redirect('/dns');
            return;
        }
        res.render('auth/login', {
            title: 'Login',
            error: null,
            timeout: req.query.timeout === '1',
            csrfToken: req.session.csrfToken || '',
        });
    }
    async login(req, res) {
        const { username, password } = req.body;
        if (!username || !password) {
            res.render('auth/login', {
                title: 'Login',
                error: 'Please fill in all fields.',
                timeout: false,
                csrfToken: req.session.csrfToken || '',
            });
            return;
        }
        const users = DatabaseService_1.dbService.select('user', '*', 'username = $username', '', {
            $username: username,
        });
        if (!users.length) {
            res.render('auth/login', {
                title: 'Login',
                error: 'Invalid username or password.',
                timeout: false,
                csrfToken: req.session.csrfToken || '',
            });
            return;
        }
        const user = users[0];
        const isBcrypt = user.password.startsWith('$2b$') || user.password.startsWith('$2a$');
        const valid = isBcrypt
            ? await bcrypt_1.default.compare(password, user.password)
            : password === user.password;
        if (!valid) {
            res.render('auth/login', {
                title: 'Login',
                error: 'Invalid username or password.',
                timeout: false,
                csrfToken: req.session.csrfToken || '',
            });
            return;
        }
        // Upgrade plain-text password to bcrypt on first successful login
        if (!isBcrypt) {
            const hashed = await bcrypt_1.default.hash(password, 12);
            DatabaseService_1.dbService.update('user', { password: hashed }, 'id = $id', { $id: user.id });
        }
        // Regenerate session to prevent fixation
        req.session.regenerate((err) => {
            if (err) {
                res.redirect('/login');
                return;
            }
            req.session.loggedin = true;
            req.session.name = user.username;
            req.session.LAST_ACTIVITY = Date.now();
            // First login as 'admin' goes to credentials page
            if (user.username === 'admin') {
                res.redirect('/account');
            }
            else {
                res.redirect('/dns');
            }
        });
    }
    logout(req, res) {
        req.session.destroy(() => {
            res.clearCookie('ibo.sid');
            res.redirect('/login');
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map