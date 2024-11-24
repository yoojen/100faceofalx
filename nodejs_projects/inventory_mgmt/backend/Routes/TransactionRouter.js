const Router = require('express').Router()
const {
    createTransaction, getTransactions,
    getTransactionById, searchTransaction,
    getTransactionByDate, getTransactionReport,
    getTransactionYearReport, updateTransaction,
    deleteTransaction
} = require('../Controllers/TransactionController');


Router.get('/transactions', getTransactions);
Router.post('/transactions', createTransaction);
Router.get('/transactions/:id', getTransactionById);
Router.get('/transactions/q/search', searchTransaction);
Router.get('/transactions/q/date', getTransactionByDate);
Router.get('/transactions/q/week', getTransactionReport);
Router.get('/transactions/q/year', getTransactionYearReport);
Router.put('/transactions/modify/:id', updateTransaction)
Router.delete('/transactions/erase/:id', deleteTransaction)
module.exports = Router;