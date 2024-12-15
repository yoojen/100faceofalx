const Router = require('express').Router()
const {
    createTransaction, getTransactions, getTransactionById,
    searchTransaction, updateTransaction, deleteTransaction,
    getAggregatedQuantity,
    getTransactionSummary,
    serveRevenueCostBarGraph
} = require('../Controllers/TransactionController');
const verifyToken = require('../Midddlelware');


// Router.use(verifyToken);
Router.get('/transactions', getTransactions);
Router.get('/transactions/summary', getTransactionSummary);
Router.get('/transactions/bar', serveRevenueCostBarGraph);
Router.get('/transactions/agg/quantity', getAggregatedQuantity);
Router.get('/transactions/:id', getTransactionById);
Router.get('/transactions/q/search', searchTransaction);
Router.post('/transactions', createTransaction);
Router.put('/transactions/modify/:id', updateTransaction)
Router.delete('/transactions/erase/:id', deleteTransaction)
module.exports = Router;