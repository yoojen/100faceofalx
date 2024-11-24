const { Op, Sequelize } = require('sequelize')
const searchItem = require('../Helpers/searchItem');
const { apiErrorHandler } = require('../Helpers/errorHandler');
const  { InventoryTransaction, User, Product } = require('../Models/models');
const getTimeDifference = require('../Helpers/dateOperations');
const sequelize = require('../Config/db.config');


module.exports.getTransactions = async (req, res) => {
    try {
        const transactions = await InventoryTransaction.findAll({});
        res.status(200).send({success: true, transactions: transactions, message: 'Retrieved successfully'})
    } catch (error) {
        res.status(400).send({success: true, transactions: transactions, message: 'Retrieved successfully'})
    }
}


module.exports.getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await InventoryTransaction.findByPk(id, {include: [User, Product]});
        if (transaction) {
            res.status(200).send({ success: true, transaction: transaction, message: 'Retrieved successfully' });
        } else {
            res.status(400).send({ success: false, transaction: null, message: 'No transaction found' });
        }
    } catch (error) {
        apiErrorHandler(res, error, 'transaction')
    }
}

module.exports.searchTransaction = async (req, res) => {
    try {
        const transaction = await searchItem(InventoryTransaction, req.query, include = [User, Product]);
        if (transaction) {
            res.status(200).send({ success: true, transaction: transaction, message: 'Retrieved successfully' });
        }
    } catch (error) {
        apiErrorHandler(res, error, 'transaction')
    }
}

module.exports.getTransactionByDate = async (req, res) => {
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

module.exports.getTransactionReport = async (req, res) => {
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
        apiErrorHandler(res, error, 'transactions')
    }
}

module.exports.getTransactionYearReport = async (req, res) => {
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

module.exports.createTransaction = async (req, res) => {
    try {
        const formData = {
            quantity, selling_price, total_amount,
            transaction_type, transaction_date, ProductId, UserId
        } = req.body;
        
        if (formData.quantity * formData.selling_price == formData.total_amount) {
            const transaction = await InventoryTransaction.create(formData)
            if (transaction) {
                res.status(201).send({ success: true, transaction: transaction.id, message: 'Transaction recorded successfully' });
                return;
            }
        } else {
            res.status(400).send({success: false, transaction: null, message: 'Invalid multiplication'})
        }
    } catch (error) {
        apiErrorHandler(res, error, 'transaction')
    }
}

module.exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const modelFields = Object.keys(InventoryTransaction.getAttributes());
        var bodyFields = Object.keys(req.body);

        const outFields = bodyFields.filter(key => !modelFields.includes(key));
        if (outFields.length > 0) {
            res.status(400).send({ success: false, transaction: null, message: `${outFields.map(key => key)} is/are not present` });
        } else {
            if (bodyFields.includes('quantity') && bodyFields.includes('selling_price')) {
                req.body.total_amount = req.body.quantity * req.body.selling_price;
            } else if (bodyFields.includes('quantity') && !bodyFields.includes('selling_price')) {
                const transaction = await InventoryTransaction.findByPk(id);
                req.body.selling_price = transaction.selling_price;
                req.body.total_amount = transaction.selling_price * req.body.quantity
            } else if (!bodyFields.includes('quantity') && bodyFields.includes('selling_price')) {
                const transaction = await InventoryTransaction.findByPk(id);
                req.body.total_amount = transaction.quantity * req.body.selling_price
                req.body.quantity = transaction.quantity;
            } else {
                req.body = req.body
            }
            const updatedTransaction = await InventoryTransaction.update(req.body, {
                where: {
                    id: id
                }
            });
            res.status(200).send({ success: true, transaction: updatedTransaction, message: 'Updated successfully' });
        }
    } catch (error) {
        apiErrorHandler(res, error, 'transaction');
    }
}

module.exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await InventoryTransaction.findByPk(id);
        if (transaction) {
            await transaction.destroy();
            res.status(204).send({ success: true, message: 'Deleted successfully' });
        } else {
            res.status(404).send({ success: false, message: 'No transaction found' });
        }
    } catch (error) {
        apiErrorHandler(res, error, 'transaction');
    }
}
