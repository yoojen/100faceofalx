const Router = require('express').Router()
const {getUsers, createUser} = require('../Controllers/UserController');

Router.get('/users', getUsers);
Router.post('/create-user', createUser);

module.exports = Router;