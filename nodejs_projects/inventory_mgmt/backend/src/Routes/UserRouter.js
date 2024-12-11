const Router = require('express').Router()
const {
    getUsers, createUser, getUserByEmail, loginUser, logoutUser, resetPassword, refreshAccessToken
} = require('../Controllers/UserController');
const verifyToken = require('../Midddlelware');

Router.get('/users', verifyToken, getUsers);
Router.post('/users/auth/register', createUser);
Router.post('/users/auth/login', loginUser);
Router.get('/users/auth/refresh', refreshAccessToken);
Router.post('/users/auth/logout', verifyToken, logoutUser);
Router.post('/users/auth/reset-psd', resetPassword);
Router.get('/users/:username', verifyToken, getUserByEmail)

module.exports = Router;