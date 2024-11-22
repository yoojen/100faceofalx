const { Op, Sequelize } = require('sequelize')
const searchItem = require('../Helpers/searchItem');
const { apiErrorHandler } = require('../Helpers/errorHandler');
const  { InventoryTransaction, User, Product } = require('../Models/models');
const getTimeDifference = require('../Helpers/dateOperations');
const sequelize = require('../Config/db.config');


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
        } 
    } catch (error) {
        apiErrorHandler(res, error, 'transaction')
    }
}

const searchTransaction = async (req, res) => {
    try {
        const transaction = await searchItem(InventoryTransaction, req.query, include = [User, Product]);
        if (transaction) {
            res.status(200).send({ success: true, transaction: transaction, message: 'Retrieved successfully' });
        }
    } catch (error) {
        apiErrorHandler(res, error, 'transaction')
    }
}

const getTransactionByDate = async (req, res) => {
    try {
        const { sDate, eDate } = req.query;
        if (sDate && !eDate) {
            var transactions = await InventoryTransaction.findAll({
                where: {
                    updatedAt: {
                        [Op.gte]: new Date(sDate)
                    }
                },
                order: [
                    ['updatedAt', 'DESC']
                ]
            })
        } else if (!sDate && eDate) {
            var transactions = await InventoryTransaction.findAll({
                where: {
                    updatedAt:{
                        [Op.lte]: new Date(eDate)
                    }
                },
                order: [
                    ['updatedAt', 'DESC']
                ]
            })
        } else {
            var transactions = await InventoryTransaction.findAll({
                where: {
                    updatedAt: {
                        [Op.between]: [new Date(sDate), new Date(eDate)]
                    }
                },
                order: [
                    ['updatedAt', 'DESC']
                ]
            })
        } 
        if (transactions) {
            res.status(200).send({ success: true, transactions: transactions, message: 'Retrieved successfully' });
        }
    } catch (error) {
        apiErrorHandler(res, error, 'transactions')
    }
}

const getTransactionReport = async (req, res) => {
    try {
        const { report } = req.query;
        const ago = getTimeDifference(report);
        const transactions = await InventoryTransaction.findAll({
                where: {
                    updatedAt:{
                        [Op.gte]: ago
                    }
                },
                order: [
                    ['updatedAt', 'DESC']
                ]
            })
        res.send({success: true, transactions: transactions, message: 'Retrieved successfully'})
    } catch (error) {
        console.log(error);
        apiErrorHandler(res, error, 'transactions')
    }
}

const getTransactionYearReport = async (req, res) => {
    try {
        const { report } = req.query;
        const transactions = await InventoryTransaction.findAll({
                where: sequelize.where(sequelize.fn('YEAR', sequelize.col('updatedAt')), report),
                order: [
                    ['updatedAt', 'DESC']
                ]
        })
        res.send({success: true, transactions: transactions, message: 'Retrieved successfully'})
    } catch (error) {
        apiErrorHandler(res, error, 'transactions')
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
    getTransactionReport,
    getTransactionYearReport,
    searchTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction
}