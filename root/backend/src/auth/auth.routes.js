const express = require('express');
const { login, register, forgotPassword, resetPassword, updateUser } = require('./auth.controller');
const { adminController, changeUserRole, deleteUser, getUsers } = require('../controllers/admin.controller');
const userController = require('../controllers/user.controller');
const requireRole = require('./auth.middleware.js');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/admin-data', requireRole(['admin']), adminController);
router.get('/user-data', requireRole(['admin', 'user']), userController);

    //Only admin
router.put('/admin/change-role', requireRole(['admin']), changeUserRole);
router.get('/admin/users', requireRole(['admin']), getUsers);
router.delete('/admin/delete-user/:userId', requireRole(['admin']), deleteUser);
router.put('/admin/update-user/:userId', requireRole(['admin']), updateUser);

module.exports = router;
