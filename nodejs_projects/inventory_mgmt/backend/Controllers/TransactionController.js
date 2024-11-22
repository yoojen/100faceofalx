const searchItem  = require('../Helpers/searchItem');
const  { InventoryTransaction, User, Product } = require('../Models/models');


const getTransactions = async (req, res) => {
    try {
        const transactions = await InventoryTransaction.findAll({});
        res.status(200).send({success: true, transactions: transactions, message: 'Retrieved successfully'})
    } catch (error) {
        res.status(400).send({success: true, transactions: transactions, message: 'Retrieved successfully'})
    }
}


const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await InventoryTransaction.findByPk(id, {include: [User, Product]});
        if (transaction) {
            res.status(200).send({ success: true, transaction: transaction, message: 'Retrieved successfully' });
        } else {
            res.status(400).send({ success: false, transaction: null, message: 'Failed to pull transaction' });
        }
    } catch (error) {
        res.status(400).send({ success: false, transaction: null, message: 'Failed to pull transaction' });
    }
}

const searchTransaction = async (req, res) => {
    try {
        const transaction = await searchItem(InventoryTransaction, req.query, include = [User, Product]);
        if (transaction) {
            res.status(200).send({ success: true, transaction: transaction, message: 'Retrieved successfully' });
        } else {
            res.status(400).send({success: false, transaction: null, message: 'Failed to pull the transaction'});
        }
    } catch (error) {
        if (error.errors) {
            const msg = error.errors[0].message;
            res.status(400).send({success: false, transaction: null, message: msg});
        }
        res.status(400).send({success: false, transaction: null, message: 'Failed to pull the transaction'});
    }
}

const getTransactionByDate = (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

const getTransactionPerWeekReport = (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

const getTransactionPerMonthReport = (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

const createTransaction = async (req, res) => {
    try {
        const { InventoryTransaction } = models;
        const formData = {
            quantity, selling_price, total_amount,
            transaction_type,transaction_date
        } = req.body;
        
        if (formData.quantity * formData.selling_price == formData.total_amount) {
            const transaction = await InventoryTransaction.create(formData)
            if (transaction) {
                res.status(201).send({success: true, transaction: transaction.id, message: 'Transaction recorded successfully'});
            } else {
                res.status(400).send({ success: false, transaction: null, message: 'Failed to record transctions' });
            }
        } else {
            res.status(400).send({success: false, transaction: null, message: 'Invalid multiplication'})
        }
    } catch (error) {
        if (error.errors) {
            const msg = error.errors[0].message;
            res.status(400).send({ success: false, transaction: null, message: msg })
        } else {
            res.status(400).send({ success: false, transaction: null, message: "Something went wrong" })
        }
    }
}

const updateTransaction = (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

const deleteTransaction = (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

module.exports = {
    getTransactions,
    getTransactionById,
    getTransactionByDate,
    getTransactionPerWeekReport,
    getTransactionPerMonthReport,
    searchTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction
}