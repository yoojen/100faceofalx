const Router = require('express').Router()
const {
    getUsers, createUser, getUserByEmail,
    loginUser, logoutUser,
    resetPassword
} = require('../Controllers/UserController');

Router.get('/users', getUsers);
Router.post('/users/auth/register', createUser);
Router.post('/users/auth/login', loginUser);
Router.post('/users/auth/logout', logoutUser);
Router.post('/users/auth/reset-psd', resetPassword);
Router.get('/users/:username', getUserByEmail)

module.exports = Router;