const { InventoryTransaction, Product, Supplier } = require('../Models/models');
const sequelize = require('../Config/db.config');
const apiErrorHandler = require('../Helpers/errorHandler');
const paginate = require('../Helpers/paginate');
const priceSearch = require('../Helpers/priceSearch');
const dateSearch = require('../Helpers/dateSearch');
const weekReport = require('../Helpers/weekReport');
const yearSearch = require('../Helpers/yearSearch');
const getTimeDifference = require('../Helpers/dateOperations');
const { Op } = require('sequelize');
require('dotenv').config()

module.exports.getTransactions = async (req, res) => {
    try {
        const {
            rows,
            count,
            totalPages,
            currentPage
        } = await paginate(req = req, model = InventoryTransaction, options = null, include = [{ model: Product }]);

        res.status(200).send({
            success: true,
            data: rows,
            totalItems: count,
            currentPage: currentPage,
            totalPages: totalPages,
            message: 'Retrieved successfully'
        });
    } catch (error) {
        apiErrorHandler(res, error, 'transactions');
    }
}


module.exports.getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await InventoryTransaction.findByPk(id, { include: [Product] });
        if (transaction) {
            res.status(200).send({ success: true, data: transaction, message: 'Retrieved successfully' });
        } else {
            res.status(400).send({ success: false, data: null, message: 'No transaction found' });
        }
    } catch (error) {
        apiErrorHandler(res, error, 'transaction')
    }
}

module.exports.searchTransaction = async (req, res) => {
    try {
        //I've to combine other query params
        let opts = withReq = {};
        const { pLess, pGreater, year, sDate, eDate, report } = req.query;
        if (pLess || pGreater) {
            delete req.query.pLess
            delete req.query.pGreater
            if (pLess && !pGreater) {
                opts = {
                    [Op.or]: [
                        { buying_price: { [Op.lte]: parseInt(pLess) } },
                        { selling_price: { [Op.lte]: parseInt(pLess) } },
                    ]
                };
            }
            if (!pLess && pGreater) {
                opts = {
                    [Op.or]: [
                        { buying_price: { [Op.gte]: parseInt(pGreater) } },
                        { selling_price: { [Op.gte]: parseInt(pGreater) } },
                    ]
                };
            }
            if (pLess && pGreater) {
                opts = {
                    [Op.or]: [
                        { buying_price: { [Op.between]: [parseInt(pLess), parseInt(pGreater)] } },
                        { selling_price: { [Op.between]: [parseInt(pLess), parseInt(pGreater)] } },
                    ]
                };
            }
        }
        if (sDate || eDate) {
            delete req.query.eDate
            delete req.query.sDate
            if (sDate && !eDate) {
                opts.updatedAt = { [Op.gte]: new Date(sDate) };
            }
            if (!sDate && eDate) {
                opts.updatedAt = { [Op.lte]: new Date(eDate) };

            }
            if (sDate && eDate) {
                opts.updatedAt = { [Op.between]: [new Date(sDate), new Date(eDate)] };
            }
            // var { rows, count, totalPages, currentPage } = await dateSearch(req, sDate, eDate);
        }
        if (report) {
            const ago = getTimeDifference(parseInt(report));
            delete req.query.report
            opts.updatedAt = { [Op.gte]: ago }
        }
        if (year) {
            delete req.query.year
            const startDate = new Date(`${parseInt(year)}-01-01`);
            const endDate = new Date(`${parseInt(year)}-12-31`);

            opts.createdAt = {
                [Op.between]: [startDate, endDate]
            };
        }
        opts = {
            [Op.and]: [
                opts, req.query
            ]
        }
        console.log(opts)
        var {
            rows,
            count,
            totalPages,
            currentPage
        } = await paginate(req = req, model = InventoryTransaction, options = opts, include = [Product]);

        res.status(200).send({
            success: true,
            data: rows,
            totalItems: count,
            currentPage: currentPage,
            totalPages: totalPages,
            message: 'Retrieved successfully'
        });
    } catch (error) {
        apiErrorHandler(res, error, 'transaction')
    }
}


module.exports.createTransaction = async (req, res) => {
    try {
        const formData = {
            quantity, selling_price, total_amount, transaction_type,
            transaction_date, ProductId
        } = req.body;
        //to be checked
        // formData.UserId = req.user.uid;

        if (!formData.ProductId) {
            res.status(400).send({ success: false, data: null, message: 'Please select product' });
            return;
        }
        if ((formData.buying_price && formData.transaction_type == 'OUT')
            || (formData.selling_price && formData.transaction_type == 'IN')
        ) {
            res.status(400).send({ success: false, data: null, message: 'Select correct transaction type' });
            return;
        }

        const product = await Product.findOne({ where: { id: formData.ProductId } });

        if (formData.transaction_type == 'IN') {
            if (!(formData.quantity * formData.buying_price == formData.total_amount) || !product) {
                res.status(400).send({ success: false, data: null, message: 'Check input' });
                return;
            }
            var transaction = InventoryTransaction.build(formData);
            await product.increment('quantity_in_stock', { by: transaction.quantity });
            await transaction.save();
        } else {
            if (!(formData.quantity * formData.selling_price == formData.total_amount) || !product) {
                res.status(400).send({ success: false, data: null, message: 'Check input' });
                return;
            }
            var transaction = InventoryTransaction.build(formData);
            await product.safeDecrement('quantity_in_stock', transaction.quantity)
            await transaction.save();
        }
        res.status(201).send({ success: true, data: transaction, message: 'Transaction recorded successfully' });
    } catch (error) {
        apiErrorHandler(res, error, 'transaction')
    }
}

module.exports.updateTransaction = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const transaction = await InventoryTransaction.findByPk(id, { include: [{ model: Product, attributes: ['id'] }] });

        if (!transaction) {
            res.status(404).send({ success: false, data: null, message: 'Transaction not found' });
            return;
        }
        const product = await Product.findByPk(transaction.Product.id);
        if (req.body.transaction_type == process.env.IN_TRANSACTION) {
            if (transaction.transaction_type == process.env.IN_TRANSACTION) {//previous transaction was IN - to be updated with IN again
                if ((transaction.quantity == req.body.quantity) || (req.body.quantity == null)) {
                    res.status(400).send({ success: false, data: null, message: 'Update values can not be the same' })
                    return;
                }
                req.body.buying_price = req.body.buying_price || transaction.buying_price;
                req.body.quantity = req.body.quantity || transaction.quantity;
                req.body.total_amount = (req.body.quantity) * (req.body.buying_price);
                const previous = product.quantity_in_stock - transaction.quantity;

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

                await Product.update({ quantity_in_stock: actualValue }, { where: { id: product.id }, transaction: t });
                var updatedTransaction = await InventoryTransaction.update(req.body, { where: { id: id }, transaction: t });
                await t.commit()
            } else {//previous transaction was OUT - to be updated with OUT again
                if ((transaction.quantity == req.body.quantity) || (req.body.quantity == null)) {
                    res.status(400).send({ success: false, data: null, message: 'Update values can not be the same' })
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
            res.status(400).send({ success: false, data: null, message: 'Something went wrong' });
        }

        res.status(200).send({ success: true, data: updatedTransaction, message: 'Updated successfully' });
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
            res.status(204).send();
        } else {
            res.status(404).send({ success: false, message: 'No transaction found' });
        }
    } catch (error) {
        apiErrorHandler(res, error, 'transaction');
    }
}
