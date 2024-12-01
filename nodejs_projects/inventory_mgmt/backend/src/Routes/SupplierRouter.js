const { 
    createSupplier,
    deleteSupplier,
    updateSupplier,
    getSuppliers,
    getSupplierById,
    searchSupplier
} = require('../Controllers/SupplierController');
const Router = require('express').Router();

Router.get('/suppliers', getSuppliers);
Router.get('/suppliers/:id', getSupplierById);
Router.get('/suppliers/q/search', searchSupplier);
Router.post('/suppliers', createSupplier);
Router.put('/suppliers/modify/:id', updateSupplier);
Router.delete('/suppliers/erase/:id', deleteSupplier);
module.exports = Router;
