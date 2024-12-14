const { Op } = require('sequelize');
const { InventoryTransaction, Supplier } = require('../Models/models');
const paginate = require('./paginate');

const priceSearch = async (req, pLess, pGreater) => {
    if (pLess && !pGreater) {
        delete req.query.pLess;

        const opts = {
            [Op.and]: [
                req.query,
                {
                    [Op.or]: [
                        { buying_price: { [Op.lte]: parseInt(pLess) } },
                        { selling_price: { [Op.lte]: parseInt(pLess) } },
                    ]
                }
            ]
        };

        var {
            rows,
            count,
            totalPages,
            currentPage
        } = await paginate(req = req, model = InventoryTransaction, options = opts, include = [Supplier]);
    } else if (!pLess && pGreater) {
        //both are qGrater only - consider other query params
        delete req.query.pGreater;
        const opts = {
            [Op.and]: [
                req.query,
                {
                    [Op.or]: [
                        { buying_price: { [Op.gte]: parseInt(pGreater) } },
                        { selling_price: { [Op.gte]: parseInt(pGreater) } },
                    ]
                }
            ]
        };

        var {
            rows,
            count,
            totalPages,
            currentPage
        } = await paginate(req = req, model = InventoryTransaction, options = opts, include = [Supplier]);
    } else if (pLess && pGreater) {
        //both are provided - consider other query params
        delete req.query.pLess, delete req.query.pGreater;
        const opts = {
            [Op.and]: [
                req.query,
                {
                    [Op.or]: [
                        { buying_price: { [Op.between]: [parseInt(pLess), parseInt(pGreater)] } },
                        { selling_price: { [Op.between]: [parseInt(pLess), parseInt(pGreater)] } },
                    ]
                }
            ]
        };

        var {
            rows,
            count,
            totalPages,
            currentPage
        } = await paginate(req = req, model = InventoryTransaction, options = opts, include = [Supplier]);

    }
    return { rows, count, totalPages, currentPage };
}

module.exports = priceSearch;