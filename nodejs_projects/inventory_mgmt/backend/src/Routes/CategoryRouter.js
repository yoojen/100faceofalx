const Router = require('express').Router()
const {
    getCategories, getCatgory,
    deleteCategory,
    updateCategory,
    createCategory
} = require('../Controllers/CategoryController')
const verifyToken = require('../Midddlelware');


Router.use(verifyToken);
Router.get('/categories', getCategories);
Router.get('/categories/:id', getCatgory);
Router.post('/categories', createCategory);
Router.put('/categories/modify/:id', updateCategory);
Router.delete('/categories/erase/:id', deleteCategory);

module.exports = Router;