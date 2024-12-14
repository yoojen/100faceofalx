const { Op } = require("sequelize");
const { InventoryTransaction, Product } = require("../Models/models");
const paginate = require("./paginate");

const dateSearch = async (req, sDate, eDate) => {
    let opts;
    delete req.query.sDate, delete req.query.eDate;

    if (sDate && !eDate) {
        opts = {
            [Op.and]: [
                req.query,
                { updatedAt: { [Op.gte]: new Date(sDate) } }
            ]
        };
        var { rows, count, totalPages, currentPage } = await paginate(
            req = req, model = InventoryTransaction, options = opts, include = [Product]
        );
    } else if (!sDate && eDate) {
        opts = {
            [Op.and]: [
                req.query,
                { updatedAt: { [Op.lte]: new Date(eDate) } }
            ]
        };
        var { rows, count, totalPages, currentPage } = await paginate(
            req = req, model = InventoryTransaction, options = opts, include = [Product]
        );
    } else {
        opts = {
            [Op.and]: [
                req.query,
                {
                    updatedAt: {
                        [Op.between]: [new Date(sDate), new Date(eDate)]
                    }
                }
            ]
        };
        var { rows, count, totalPages, currentPage } = await paginate(
            req = req, model = InventoryTransaction, options = opts, include = [Product]
        );

    }
    return { rows, count, totalPages, currentPage };
}

module.exports = dateSearch;