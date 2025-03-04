const { InventoryTransaction, Product, Supplier, Category } = require('../Models/models');
const sequelize = require('../Config/db.config');
const apiErrorHandler = require('../Helpers/errorHandler');
const paginate = require('../Helpers/paginate');
const getTimeDifference = require('../Helpers/dateOperations');
const { Op, Sequelize } = require('sequelize');
require('dotenv').config()


module.exports.getTransactions = async (req, res) => {
    try {
        const { rows, count, totalPages, currentPage } = await paginate(
            req = req, model = InventoryTransaction, options = null, include = [{ model: Supplier }, { model: Product }]
        );

        res.status(200).send({
            success: true, data: rows, totalItems: count, currentPage: currentPage,
            totalPages: totalPages, message: 'Retrieved successfully'
        });
    } catch (error) {
        apiErrorHandler(res, error, 'transactions');
    }
}


module.exports.getproductInventorySummary = async (req, res) => {
    const transaction_type = req.query.transaction_type;
    const productCounts = {};

    try {
        const rows = await InventoryTransaction.findAll({
            attributes: [
                'transaction_type',
                'ProductId',
                [sequelize.fn('COUNT', sequelize.col('InventoryTransaction.id')), 'totalTransactions'],
            ],
            where: {
                [Op.and]: [
                    { createdAt: { [Op.gte]: getTimeDifference(4) } },
                    (transaction_type) && { transaction_type: transaction_type }
                ]
            },
            include: [
                {
                    model: Product,
                    attributes: ['name'],
                    required: true,
                    include: {
                        model: Category,
                        attributes: ['name']
                    }
                }
            ],
            group: ['transaction_type', 'ProductId'],
            order: [['totalTransactions', 'DESC']],
        });
        rows.forEach(item => {
            const { transaction_type, Product: { name } } = item;

            if (!productCounts[name]) {
                productCounts[name] = { IN: 0, OUT: 0 };
            }

            productCounts[name][transaction_type] = item.dataValues.totalTransactions;
        });

        res.status(200).send({ success: true, data: rows, graphData: productCounts, message: 'Retrieved successfully' });
    } catch (error) {
        console.log(error);
        apiErrorHandler(res, error, 'transaction');
    }
}

module.exports.serveRevenueCostBarGraph = async (req, res) => {

    const { groupby } = req.query;
    try {
        if (groupby === 'month') {
            var rows = await InventoryTransaction.findAll({
                attributes: [
                    [sequelize.fn('date_format', sequelize.col('createdAt'), '%M'), 'month'],
                    [sequelize.fn('SUM', sequelize.literal('CASE WHEN transaction_type="IN" THEN total_amount ELSE 0 END')), 'totalCost'],
                    [sequelize.fn('SUM', sequelize.literal('CASE WHEN transaction_type="OUT" THEN total_amount ELSE 0 END')), 'totalRevenue']
                ],
                group: [groupby],
                order: [groupby]
            })
        } else if (groupby === 'year') {
            var rows = await InventoryTransaction.findAll({
                attributes: [
                    [sequelize.fn('date_format', sequelize.col('createdAt'), '%Y'), 'year'],
                    [sequelize.fn('SUM', sequelize.literal('CASE WHEN transaction_type="IN" THEN total_amount ELSE 0 END')), 'totalCost'],
                    [sequelize.fn('SUM', sequelize.literal('CASE WHEN transaction_type="OUT" THEN total_amount ELSE 0 END')), 'totalRevenue']
                ],
                group: [groupby],
                order: [groupby]
            })
        } else if (groupby === 'yearMonth') {
            var rows = await InventoryTransaction.findAll({
                attributes: [
                    [sequelize.fn('date_format', sequelize.col('createdAt'), '%Y-%m'), 'yearMonth'],
                    [sequelize.fn('SUM', sequelize.literal('CASE WHEN transaction_type="IN" THEN total_amount ELSE 0 END')), 'totalCost'],
                    [sequelize.fn('SUM', sequelize.literal('CASE WHEN transaction_type="OUT" THEN total_amount ELSE 0 END')), 'totalRevenue']
                ],
                group: [groupby],
                order: [groupby]
            })
        } else {
            const year = req.query.year || new Date().getFullYear();

            var rows = await sequelize.query(`SELECT 
                transaction_type,
                    round(SUM(daily_sales)/ abs(timestampdiff(day, MAX(createdAt), MIN(createdAt))), 2) AS daily,
                    round(AVG(daily_sales) / (abs(timestampdiff(day, MAX(createdAt), MIN(createdAt)))/7), 2) AS weekly,
                    round(AVG(daily_sales) / (abs(timestampdiff(day, MAX(createdAt), MIN(createdAt)))/30), 2) AS monthly
                FROM (
                    SELECT SUM(total_amount) AS daily_sales,
                    DATE(createdAt) AS createdAt,
                    transaction_type,
                    COUNT(DATE(createdAt))
                    FROM inventorytransactions
                    WHERE transaction_type='OUT' AND YEAR(createdAt) = ${year}
                    GROUP BY DATE(createdAt), transaction_type
                ) AS daily_sales_subquery
                GROUP BY transaction_type`, { type: Sequelize.QueryTypes.SELECT }
            );

        }

        res.send({ success: true, data: rows, message: 'Retrieved successfully', model: 'transaction' });
    } catch (error) {
        console.log(error)
        apiErrorHandler(res, error, 'transaction');
    }
}


module.exports.getProductProfitMargin = async (req, res) => {

    try {
        const rows = await InventoryTransaction.findAll({
            attributes: [
                [
                    sequelize.fn(
                        'AVG',
                        sequelize.col('buying_price')

                    ),
                    'average_cost_price'
                ],
                [
                    sequelize.fn(
                        'AVG',
                        sequelize.col('selling_price')
                    ),
                    'average_selling_price'
                ],

            ],
            include: [
                {
                    model: Product,
                    attributes: ['name'],
                    require: true,
                    include: [
                        {
                            model: Category,
                            attributes: ['name']
                        }
                    ]
                }
            ],
            group: ['ProductId']
        });

        res.status(200).send({ success: true, data: rows, message: 'Retrieved successfully' });
    } catch (error) {
        console.log(error)
        apiErrorHandler(res, error, 'transaction');
    }
}

module.exports.getAggreagatedReport = async (req, res) => {
    var page = parseInt(req.query.page) || 1;
    var pageSize = parseInt(req.query.pageSize) || 1000;
    const month = getTimeDifference(4);

    try {
        var { count, rows } = await InventoryTransaction.findAndCountAll({
            attributes: [
                'transaction_type',
                [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalAmount'],
                [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity']
            ],
            where: {
                [Op.and]: [
                    { createdAt: { [Op.gte]: month } },
                    (req.query.transaction_type) && { transaction_type: req.query.transaction_type }
                ]
            },
            include: {
                model: Product,
                attributes: ['name'],
                required: true,
                include: {
                    model: Category,
                    attributes: ['id', 'name'],
                    required: true
                }
            },
            offset: (page - 1) * pageSize,
            limit: pageSize,
            group: ['transaction_type', 'ProductId'],
            order: [['totalAmount', 'DESC']]
        })

        res.status(200).send({
            success: true, data: rows, totalItems: count.length, totalPages: Math.ceil(count.length / pageSize),
            currentPage: page, message: 'Retrieved successfully'
        });
    } catch (error) {
        console.log(error)
        apiErrorHandler(res, error, 'transaction');
    }
}

module.exports.getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await InventoryTransaction.findByPk(id, { include: [{ model: Supplier }, { model: Product }] });
        if (transaction) {
            res.status(200).send({ success: true, data: transaction, message: 'Retrieved successfully' });
        } else {
            res.status(400).send({ success: false, error: 'No transaction found' });
        }
    } catch (error) {
        apiErrorHandler(res, error, 'transaction')
    }
}

module.exports.getTransactionSummary = async (req, res) => {
    try {
        let revenue = await InventoryTransaction.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalRevenue'],
            ],
            where: { transaction_type: 'OUT', createdAt: { [Op.gte]: getTimeDifference(4) } }
        })
        let cost = await InventoryTransaction.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalCost']],
            where: { transaction_type: 'IN', createdAt: { [Op.gte]: getTimeDifference(4) } }
        })
        revenue = revenue[0].dataValues.totalRevenue;
        cost = cost[0].dataValues.totalCost;

        return res.status(200).send({ data: { revenue, cost: cost, profit: revenue - cost } });
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
                opts.createdAt = { [Op.gte]: new Date(sDate) };
            }
            if (!sDate && eDate) {
                opts.createdAt = { [Op.lte]: new Date(eDate) };

            }
            if (sDate && eDate) {
                opts.createdAt = { [Op.between]: [new Date(sDate), new Date(eDate)] };
            }
            // var { rows, count, totalPages, currentPage } = await dateSearch(req, sDate, eDate);
        }
        if (report) {
            const ago = getTimeDifference(parseInt(report));
            delete req.query.report
            opts.createdAt = { [Op.gte]: ago }
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

        var { rows, count, totalPages, currentPage } = await paginate(
            req = req, model = InventoryTransaction, options = opts, include = [{ model: Supplier }, { model: Product, }]
        );

        res.status(200).send({
            success: true, data: rows, totalItems: count, currentPage: currentPage,
            totalPages: totalPages, message: 'Retrieved successfully'
        });
    } catch (error) {
        apiErrorHandler(res, error, 'transaction')
    }
}


module.exports.createTransaction = async (req, res) => {
    try {
        const formData = { quantity, selling_price, total_amount, transaction_type, transaction_date, ProductId } = req.body;
        //to be checked
        // formData.UserId = req.user.uid;

        if (!formData.ProductId) {
            return res.status(400).send({ success: false, error: 'Please select product' });
        }
        console.log(formData)
        if ((formData.buying_price && formData.transaction_type == 'OUT')
            || (formData.selling_price && formData.transaction_type == 'IN')
        ) {
            return res.status(400).send({ success: false, error: 'Select correct transaction type' });
        }

        const product = await Product.findOne({ where: { id: formData.ProductId } });
        if ((product.quantity_in_stock < formData.quantity) && formData.transaction_type == 'OUT') {
            return res.status(400).send({ success: false, error: `Only ${product.quantity_in_stock} Remains in stock` });
        }
        if (formData.transaction_type == 'IN') {
            //replacing frontend zero (0) with null (acceptable by db)
            formData.selling_price = null;
            if (!(formData.quantity * formData.buying_price == formData.total_amount) || !product) {
                res.status(400).send({ success: false, error: 'Check input' });
                return;
            }
            var transaction = InventoryTransaction.build(formData);
            await product.increment('quantity_in_stock', { by: transaction.quantity });
            await transaction.save();
        } else {
            //replacing frontend zero (0) with null (acceptable by db)
            formData.buying_price = null;
            if (!(formData.quantity * formData.selling_price == formData.total_amount) || !product) {
                res.status(400).send({ success: false, error: 'Check input' });
                return;
            }
            var transaction = InventoryTransaction.build(formData);
            await product.safeDecrement('quantity_in_stock', transaction.quantity)
            await transaction.save();
        }
        res.status(201).send({ success: true, data: transaction, message: 'Transaction recorded successfully' });
    } catch (error) {
        console.log(error)
        apiErrorHandler(res, error, 'transaction')
    }
}

module.exports.updateTransaction = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const transaction = await InventoryTransaction.findByPk(id, { include: [{ model: Product, attributes: ['id'] }] });

        if (!transaction) {
            res.status(404).send({ success: false, error: 'Transaction not found' });
            return;
        }
        const product = await Product.findByPk(transaction.Product.id);
        if (req.body.transaction_type == process.env.IN_TRANSACTION) {
            if (transaction.transaction_type == process.env.IN_TRANSACTION) {//previous transaction was IN - to be updated with IN again
                if ((transaction.quantity == req.body.quantity && transaction.buying_price == req.body.buying_price) || !req.body.quantity || !req.body.buying_price) {
                    res.status(400).send({ success: false, error: 'Update values can not be the same' })
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
                if ((transaction.quantity == req.body.quantity && transaction.selling_price == req.body.selling_price) || !req.body.quantity || !req.body.selling_price) {
                    res.status(400).send({ success: false, error: 'Update values can not be the same' })
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
            res.status(400).send({ success: false, error: 'Something went wrong' });
        }

        res.status(200).send({ success: true, data: updatedTransaction, message: 'Updated successfully' });
    } catch (error) {
        await t.rollback();
        console.log(error)
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
