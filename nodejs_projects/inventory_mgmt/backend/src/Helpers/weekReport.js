const { Op } = require("sequelize");
const paginate = require("./paginate");
const getTimeDifference = require("./dateOperations");
const { InventoryTransaction, Product } = require("../Models/models");

const weekReport = async (req, report) => {
    const ago = getTimeDifference(report);

    delete req.query.report
    const opts = {
        [Op.and]: [
            req.query,
            { updatedAt: { [Op.gte]: ago } }
        ]
    }
    const { rows, count, totalPages, currentPage } = await paginate(
        req = req, model = InventoryTransaction, options = opts, include = [Product]
    );
    return { rows, count, totalPages, currentPage };
}

module.exports = weekReport;