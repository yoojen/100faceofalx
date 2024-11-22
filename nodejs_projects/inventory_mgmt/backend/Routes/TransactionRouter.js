const Router = require('express').Router()
const {
    createTransaction, getTransactions,
    getTransactionById, searchTransaction
} = require('../Controllers/TransactionController');


Router.get('/transactions', getTransactions);
Router.post('/transactions', createTransaction);
Router.get('/transactions/:id', getTransactionById);
Router.get('/transactions/q/search', searchTransaction);

module.exports = Router;