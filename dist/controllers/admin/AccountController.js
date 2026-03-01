"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const DatabaseService_1 = require("../../services/DatabaseService");
class AccountController {
    show(req, res) {
        const user = DatabaseService_1.dbService.getOne('user', 'id = 1');
        res.render('account/credentials', {
            title: 'Update Credentials',
            user,
            flash: res.locals.flash,
        });
    }
    async update(req, res) {
        const { username, password, confirm_password } = req.body;
        if (!username || !password) {
            res.flash('warning', 'Please fill in all fields.');
            res.redirect('/account');
            return;
        }
        if (password !== confirm_password) {
            res.flash('warning', 'Passwords do not match.');
            res.redirect('/account');
            return;
        }
        const hashed = await bcrypt_1.default.hash(password, 12);
        DatabaseService_1.dbService.update('user', { username, password: hashed }, 'id = 1');
        // Update session with new username
        req.session.name = username;
        res.flash('success', 'Credentials updated successfully.');
        res.redirect('/account');
    }
}
exports.AccountController = AccountController;
//# sourceMappingURL=AccountController.js.map