"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemesController = void 0;
const DatabaseService_1 = require("../../services/DatabaseService");
const THEMES = Array.from({ length: 17 }, (_, i) => `theme_${i + 1}`);
class ThemesController {
    index(req, res) {
        const row = DatabaseService_1.dbService.getOne('theme', 'id = 1');
        res.render('themes/index', {
            title: 'App Themes',
            currentTheme: row?.theme_no || 'theme_0',
            themes: THEMES,
            flash: res.locals.flash,
        });
    }
    update(req, res) {
        const { theme_no } = req.body;
        const existing = DatabaseService_1.dbService.getOne('theme', 'id = 1');
        if (existing) {
            DatabaseService_1.dbService.update('theme', { theme_no }, 'id = 1');
        }
        else {
            DatabaseService_1.dbService.insert('theme', { id: 1, theme_no });
        }
        res.flash('success', `Theme set to ${theme_no}.`);
        res.redirect('/themes');
    }
}
exports.ThemesController = ThemesController;
//# sourceMappingURL=ThemesController.js.map