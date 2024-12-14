const Router = require('express').Router()
const {
    createTransaction, getTransactions, getTransactionById,
    searchTransaction, updateTransaction, deleteTransaction,
} = require('../Controllers/TransactionController');
const verifyToken = require('../Midddlelware');


// Router.use(verifyToken);
Router.get('/transactions', getTransactions);
Router.post('/transactions', createTransaction);
Router.get('/transactions/:id', getTransactionById);
Router.get('/transactions/q/search', searchTransaction);
Router.put('/transactions/modify/:id', updateTransaction)
Router.delete('/transactions/erase/:id', deleteTransaction)
module.exports = Router;