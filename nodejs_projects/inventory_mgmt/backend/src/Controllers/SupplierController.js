const { Op } = require("sequelize");
const sequelize = require("../Config/db.config");
const { InventoryTransaction, Supplier } = require("../Models/models");
const apiErrorHandler = require("../Helpers/errorHandler");
const paginate = require('../Helpers/paginate');


module.exports.getSuppliers = async (req, res) => {
    try {
        const { 
            rows, 
            count,
            totalPages,
            currentPage
        } = await paginate(req = req, model = Supplier, options = null, include = [InventoryTransaction]);

        res.status(200).send({
            success: true,
            data: rows,
            totalItems: count,
            currentPage: currentPage,
            totalPages: totalPages,
            message: 'Retrieved successfully'
        });
    } catch (error) {
        apiErrorHandler(res, error, 'supplier');
    }
}

module.exports.getSupplierById = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.findByPk(id, { include: [InventoryTransaction] });
        if (supplier) {
            res.status(200).send({ success: true, data: supplier, message: 'Retrieved successfully' });
        } else {
            res.status(400).send({ success: false, data: null, message: 'No supplier found' });
        }
    } catch (error) {
        apiErrorHandler(res, error, 'transaction')
    }
}

module.exports.searchSupplier = async (req, res) => {
    try {
        const {
            rows,
            count,
            totalPages,
            currentPage
        } = await paginate(req = req, model = Supplier, options = req.query, include = [InventoryTransaction]);

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


module.exports.createSupplier = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const formData = { name, isSpecial, balance } = req.body;
        const found = await models.Supplier.findOne({ where: { name: formData.name } });
        if (found) {
            res.status(400).send({ success: false, supplier: null, message: 'Supplier already exists' });
            return;
        }
        const supplier = await models.Supplier.create(formData, { transaction: t });
        await t.commit();
        res.status(201).send({ success: true, data: supplier, message: 'Supplier created successfully' });
    } catch (error) {
        await t.rollback();
        apiErrorHandler(res, error, 'supplier');
    }
}


module.exports.updateSupplier = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const supplier = await models.Supplier.findByPk(id);
        if (!supplier) {
            res.status(404).send({ success: false, data: null, message: 'Supplier is not found' });
            return;
        }
        const affectedRows = await models.Supplier.update(req.body, { where: { id: id }, transaction: t });
        if (affectedRows[0] > 0) {
            await t.commit();
            const updatedSupplier = await models.Supplier.findByPk(id);
            res.status(200).send({ success: true, data: updatedSupplier, message: 'Updated successfully' });
            return;
        } else {
            await t.rollback();
            res.status(400).send({ success: false, data: null, message: 'Failed to update supplier' });
            return;
        }
    } catch (error) {
        await t.rollback();
        apiErrorHandler(res, error, 'supplier');
    }
}

module.exports.deleteSupplier = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const supplier = await models.Supplier.findByPk(id);
        if (!supplier) {
            res.status(404).send({ success: false, data: null, message: 'Supplier is not found' });
            return;
        }
        await supplier.destroy({ transaction: t });
        await t.commit();
        res.status(204).send();
    } catch (error) {
        await t.rollback()
        apiErrorHandler(res, error, 'supplier');
    }
}