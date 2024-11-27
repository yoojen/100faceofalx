const { Op, where } = require('sequelize')
const searchItem = require('../Helpers/searchItem');
const { apiErrorHandler } = require('../Helpers/errorHandler');
const  { InventoryTransaction, User, Product } = require('../Models/models');
const getTimeDifference = require('../Helpers/dateOperations');
const sequelize = require('../Config/db.config');
require('dotenv').config()

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
            quantity, selling_price, total_amount, transaction_type,
            SpecialCustomerId, transaction_date, ProductId, UserId
        } = req.body;

        if (!formData.ProductId) {
            res.status(400).send({ success: false, transaction: null, message: 'Please select product' });
            return;
        }
        if ((formData.buying_price && formData.transaction_type == 'OUT')
            || (formData.selling_price && formData.transaction_type == 'IN')
        ) {
            res.status(400).send({ success: false, transaction: null, message: 'Select correct transaction type' });
            return;
        }
        if ((formData.SpecialCustomerId && formData.SupplierId)
        ) {
            res.status(400).send({ success: false, transaction: null, message: 'Choose either supplier or special customer' });
            return;
        }
        const product = await Product.findOne({ where: { id: formData.ProductId } });

        if (formData.transaction_type == 'IN') {
            if (!(formData.quantity * formData.buying_price == formData.total_amount) || !product) {
                res.status(400).send({ success: false, transaction: null, message: 'Check input' });
                return;
            }
            var transaction = InventoryTransaction.build(formData);
            await product.increment('quantity_in_stock', { by: transaction.quantity });
            await transaction.save();
        } else {
            if (!(formData.quantity * formData.selling_price == formData.total_amount) || !product) {
                res.status(400).send({ success: false, transaction: null, message: 'Check input' });
                return;
            }
            var transaction = InventoryTransaction.build(formData);
            await product.safeDecrement('quantity_in_stock', transaction.quantity)
            await transaction.save();
        }
        res.status(201).send({ success: true, transaction: transaction, message: 'Transaction recorded successfully' });
    } catch (error) {
        apiErrorHandler(res, error, 'transaction')
    }
}

module.exports.updateTransaction = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const transaction = await InventoryTransaction.findByPk(id, {include: [{model: Product, attributes: ['id']}]});
        
        if (!transaction){
            res.status(404).send({ success: false, transaction: null, message: 'Transaction not found' });
            return;
        }
        const product = await Product.findByPk(transaction.Product.id);
        if (req.body.transaction_type == process.env.IN_TRANSACTION) {
            if (transaction.transaction_type == process.env.IN_TRANSACTION) {//previous transaction was IN - to be updated with IN again
                if ((transaction.quantity == req.body.quantity) || (req.body.quantity == null)) {
                    res.status(400).send({ success: false, transaction: null, message: 'Update values can not be the same' })
                    return;
                }
                req.body.buying_price = req.body.buying_price || transaction.buying_price;
                req.body.quantity = req.body.quantity || transaction.quantity;
                req.body.total_amount = (req.body.quantity) * (req.body.buying_price);
                const previous = product.quantity_in_stock - transaction.quantity;
                console.log(req.body);
                var updatedTransaction = await InventoryTransaction.update(req.body, { where: { id: id }, transaction: t });
                await Product.update({ quantity_in_stock: previous + (req.body.quantity) }, { where: { id: product.id }, transaction: t });
                await t.commit();
            } else {//previous transaction was OUT - to be updated with IN again
                const incrementor = transaction.quantity == req.body.quantity ? transaction.quantity : transaction.quantity + (req.body.quantity || 0)
                req.body.buying_price = req.body.buying_price || transaction.selling_price;
                req.body.quantity = req.body.quantity || transaction.quantity;
                req.body.total_amount = (req.body.quantity) * (req.body.buying_price);
                req.body.selling_price = null

                var updatedTransaction = await InventoryTransaction.update(req.body, { where: { id: id }, transaction: t });
                await product.increment('quantity_in_stock', { by: incrementor }, { transaction: t });
                await t.commit();
            }

        } else if (req.body.transaction_type == process.env.OUT_TRANSACTION) {
            if (transaction.transaction_type == process.env.IN_TRANSACTION) { //previous transaction was IN - to be updated with OUT
                const previous = product.quantity_in_stock - transaction.quantity;
                req.body.selling_price = req.body.selling_price || transaction.buying_price;
                req.body.quantity = req.body.quantity || transaction.quantity;
                req.body.total_amount = (req.body.quantity) * (req.body.selling_price);
                req.body.buying_price = null;
                const actualValue = transaction.quantity != req.body.quantity ? previous - (req.body.quantity || 0) : previous
                console.log(req.body);
                await Product.update({ quantity_in_stock: actualValue }, { where: { id: product.id }, transaction: t });
                var updatedTransaction = await InventoryTransaction.update(req.body, { where: { id: id }, transaction: t });
                await t.commit()
            } else {//previous transaction was OUT - to be updated with OUT again
                if ((transaction.quantity == req.body.quantity) || (req.body.quantity == null)) {
                    res.status(400).send({ success: false, transaction: null, message: 'Update values can not be the same' })
                    return;
                }
                const previous = product.quantity_in_stock + transaction.quantity;
                req.body.selling_price = req.body.selling_price || transaction.selling_price;
                req.body.total_amount = (req.body.quantity || transaction.quantity) * (req.body.selling_price);
                req.body.buying_price = null;

                var updatedTransaction = await InventoryTransaction.update(req.body, { where: { id: id }, transaction: t });
                await Product.update({ quantity_in_stock: previous - (req.body.quantity || 0) }, {
                    where: { id: product.id }, transaction: t
                });
                await t.commit();
            }
        } else {
            res.status(400).send({ success: false, transaction: null, message: 'Something went wrong' });
        }
       
        res.status(200).send({ success: true, transaction: updatedTransaction, message: 'Updated successfully' });
    } catch (error) {
        await t.rollback();
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
