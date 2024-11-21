const Router = require('express').Router()
const {getUsers, createUser, getUserById} = require('../Controllers/UserController');

Router.get('/users', getUsers);
Router.post('/create-user', createUser);
Router.get('/users/:username', getUserById)

module.exports = Router;