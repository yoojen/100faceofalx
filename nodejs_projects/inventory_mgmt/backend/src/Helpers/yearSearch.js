const { Op } = require("sequelize");
const sequelize = require("../Config/db.config");
const { InventoryTransaction, Product } = require("../Models/models");
const paginate = require("./paginate");

const yearSearch = async (req, year) => {
    const yearOpt = sequelize.where(sequelize.fn('YEAR', sequelize.col('InventoryTransaction.updatedAt')), year);
    req.query.sort = 'updatedAt-DESC';
    delete req.query.year
    const opts = {
        [Op.and]: [
            req.query,
            yearOpt
        ]
    }
    const { rows, count, totalPages, currentPage } = await paginate(
        req = req, model = InventoryTransaction, options = opts, include = [Product]
    );
    return { rows, count, totalPages, currentPage };
}

module.exports = yearSearch;