const AuthRouter = require('express').Router()
const {
    getUsers, createUser, getUserByEmail, loginUser, logoutUser, resetPassword, refreshAccessToken
} = require('../Controllers/UserController');
const verifyToken = require('../Midddlelware');

AuthRouter.get('/users', verifyToken, getUsers);
AuthRouter.post('/users/auth/register', createUser);
AuthRouter.post('/users/auth/login', loginUser);
AuthRouter.get('/users/auth/refresh', refreshAccessToken);
AuthRouter.post('/users/auth/logout', verifyToken, logoutUser);
AuthRouter.post('/users/auth/reset-psd', resetPassword);
AuthRouter.get('/users/:username', verifyToken, getUserByEmail)

module.exports = AuthRouter;