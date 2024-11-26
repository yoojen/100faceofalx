const {
    createProduct, getProducts, getProductById,
    searchProduct, updateProduct,
    deleteProduct
} = require('../Controllers/ProductControllers');

const Router = require('express').Router();


Router.get('/products', getProducts);
Router.get('/products/:id', getProductById);
Router.get('/products/q/search', searchProduct);
Router.post('/products', createProduct);
Router.put('/products/modify/:id', updateProduct);
Router.delete('/products/erase/:id', deleteProduct);
module.exports = Router;