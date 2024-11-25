const { createProduct, getProducts, getProductById, searchProduct } = require('../Controllers/ProductControllers');

const Router = require('express').Router();


Router.get('/products', getProducts);
Router.get('/products/:id', getProductById);
Router.get('/products/q/search', searchProduct);
Router.post('/products', createProduct);

module.exports = Router;