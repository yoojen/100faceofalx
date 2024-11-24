const { addProduct } = require('../Controllers/ProductControllers');

const Router = require('express').Router();


Router.post('/products', addProduct);

module.exports = Router;