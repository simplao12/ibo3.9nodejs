"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const DatabaseService_1 = require("../../services/DatabaseService");
const RESULTS_PER_PAGE = 30;
class UsersController {
    index(req, res) {
        const page = parseInt(String(req.query.view || '1'), 10);
        const searchTerm = String(req.query.search || '');
        const offset = (page - 1) * RESULTS_PER_PAGE;
        let where = '';
        const params = {};
        if (searchTerm) {
            where = 'mac_address LIKE $search OR title LIKE $search';
            params.$search = `%${searchTerm}%`;
        }
        const countResult = DatabaseService_1.dbService.selectWithCount('ibo', 'id', where, params);
        const total = countResult[0]?.total ?? 0;
        const totalPages = Math.ceil(total / RESULTS_PER_PAGE);
        const users = DatabaseService_1.dbService.selectPaged('ibo', '*', where, params, RESULTS_PER_PAGE, offset);
        res.render('users/index', {
            title: 'MAC Users',
            users,
            page,
            totalPages,
            searchTerm,
            flash: res.locals.flash,
        });
    }
    showCreate(req, res) {
        res.render('users/create', { title: 'Add New User', flash: [] });
    }
    create(req, res) {
        const { mac_address, protection, title, url, username, password } = req.body;
        if (!mac_address || !title || !url || !username || !password) {
            res.flash('warning', 'Please fill in all required fields.');
            res.redirect('/users/create');
            return;
        }
        DatabaseService_1.dbService.insert('ibo', { mac_address, protection: protection || '0', title, url, username, password });
        res.flash('success', 'User added successfully.');
        res.redirect('/users');
    }
    showEdit(req, res) {
        const id = parseInt(req.params.id, 10);
        const user = DatabaseService_1.dbService.getOne('ibo', 'id = $id', { $id: id });
        if (!user) {
            res.flash('danger', 'User not found.');
            res.redirect('/users');
            return;
        }
        res.render('users/edit', { title: 'Edit User', user, flash: [] });
    }
    update(req, res) {
        const id = parseInt(req.params.id, 10);
        const { mac_address, protection, title, url, username, password } = req.body;
        if (!mac_address || !title || !url || !username || !password) {
            res.flash('warning', 'Please fill in all required fields.');
            res.redirect(`/users/${id}/edit`);
            return;
        }
        DatabaseService_1.dbService.update('ibo', { mac_address, protection: protection || '0', title, url, username, password }, 'id = $id', { $id: id });
        res.flash('success', 'User updated successfully.');
        res.redirect('/users');
    }
    delete(req, res) {
        const id = parseInt(req.params.id, 10);
        DatabaseService_1.dbService.delete('ibo', 'id = $id', { $id: id });
        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            res.json({ success: true });
            return;
        }
        res.flash('danger', 'User deleted.');
        res.redirect('/users');
    }
}
exports.UsersController = UsersController;
//# sourceMappingURL=UsersController.js.map