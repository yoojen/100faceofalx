const Router = require('express').Router()
const {
    createTransaction, getTransactions,
    getTransactionById, searchTransaction,
    getTransactionByDate,
    getTransactionReport,
    getTransactionYearReport
} = require('../Controllers/TransactionController');


Router.get('/transactions', getTransactions);
Router.post('/transactions', createTransaction);
Router.get('/transactions/:id', getTransactionById);
Router.get('/transactions/q/search', searchTransaction);
Router.get('/transactions/q/date', getTransactionByDate);
Router.get('/transactions/q/week', getTransactionReport);
Router.get('/transactions/q/year', getTransactionYearReport);

module.exports = Router;