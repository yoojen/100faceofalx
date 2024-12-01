const sequelize = require('../Config/db.config');
const { Product, Category, InventoryTransaction } = require('../Models/models');
const apiErrorHandler = require('../Helpers/errorHandler');
const paginate = require('../Helpers/paginate');
const { Op } = require('sequelize');



module.exports.getProducts = async (req, res) => {
    try {
        const {
            rows,
            count,
            totalPages,
            currentPage 
        } = await paginate(req, Product, options=null, include=[Category]);

        res.status(200).send({
            success: true,
            data: rows,
            totalItems: count,
            totalPages: totalPages,
            currentPage: currentPage,
            messaage: 'Retrieved successfully'
        });
    } catch (error) {
        apiErrorHandler(res, error, 'product');
    }
}

module.exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        res.status(200).send({ success: true, data: product, message: 'Retrieved successfully' });
    } catch (error) {
        apiErrorHandler(res, error, 'product');
    }
}

module.exports.searchProduct = async (req, res) => {
    try {
        const {
            rows,
            count,
            totalPages,
            currentPage
        } = await paginate(req = req, model = Product, options = req.query);

        res.status(200).send({
            success: true,
            data: rows,
            totalItems: count,
            currentPage: currentPage,
            totalPages: totalPages,
            message: 'Retrieved successfully'
        });
    } catch (error) {
        apiErrorHandler(res, error, 'product');
    }
}

module.exports.searchQuantityLessOrGreater = async (req, res) => {
    try {
        const { qLess, qGreater } = req.query;
        //I've to combine other query params and finnaly filer by quantity
        if (qLess && !qGreater) {
            req.query.quantity_in_stock = { [Op.lte]: qLess };
            delete req.query.qLess;
            var {
                rows,
                count,
                totalPages,
                currentPage
            } = await paginate(req = req, model = Product, options = req.query, include = [InventoryTransaction]);
        } else if (!qLess && qGreater) {
            //both are qGrater only - consider other query params
            req.query.quantity_in_stock = { [Op.gte]: qGreater };
            delete req.query.qGreater;
            var {
                rows,
                count,
                totalPages,
                currentPage
            } = await paginate(req = req, model = Product, options = req.query, include = [InventoryTransaction]);
        } else {
            //both are provided - consider other query params
            req.query.quantity_in_stock = { [Op.between]: [qLess, qGreater] };

            delete req.query.qLess, delete req.query.qGreater;
            var {
                rows,
                count,
                totalPages,
                currentPage
            } = await paginate(req = req, model = Product, options = req.query, include = [InventoryTransaction]);

        }
        res.status(200).send({
            success: true,
            data: rows,
            totalItems: count,
            currentPage: currentPage,
            totalPages: totalPages,
            message: 'Retrieved successfully'
        });
    
    } catch (error) {
        apiErrorHandler(res, error, 'products')
    }
}

module.exports.createProduct = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const formData = {
            name, description, price, quantity_in_stock, CategoryId, categoryName
        } = req.body;
        //If product exists
        if (await Product.findOne({ where: { name: formData.name } })) {
            res.status(400).send({ success: false, data: null, message: 'Product already exists' });
            return;
        }

        //Creation of category
        if (!formData.CategoryId && !formData.categoryName) {
            res.status(400).send({ success: false, data: null, message: 'Please select category or create one' });
            return;
        }
        if (formData.CategoryId) {
            const category = await Category.findByPk(formData.CategoryId);
            if (!category) {
                res.status(400).send({ success: false, data: null, message: 'Category doesn\'t exist. Please create category' });
                return;
            }
        }
        else if (formData.categoryName) {
            try {
                const category = await Category.create({ name: formData.categoryName });
                formData.CategoryId = category.id;
            } catch (error) {
                apiErrorHandler(res, error, 'category');
            }
        }

        var product = await Product.create(formData, {transaction: t});
        if (product) {
            await t.commit();
            res.status(200).send({ success: true, data: product, message: 'Product added successfully' });
        } else {
            await t.rollback();
            res.status(400).send({ success: false, data: null, message: 'Invalid input' });
        }
    } catch (error) {
        await t.rollback();
        apiErrorHandler(res, error, 'product')
    }
}

module.exports.updateProduct = async (req, res) => {
    const t = await sequelize.transaction()
    try {
        const { id } = req.params;
        if (Object.keys(req.body).length < 1) {
            res.status(400).send({ success: false, data: null, message: 'Update parameters missing' });
            return;
        }
        const product = await Product.findOne({ where: { id: id } });
        if (!product) {
            res.status(400).send({ success: false, data: null, message: 'No product found' });
        }
        const affectedRows = await Product.update(req.body, { where: { id: id }, transaction: t });
        if (affectedRows[0] > 0){
            await t.commit();
            res.status(200).send({ success: true, data: product, message: 'Updated successfully' });
        } else {
            await t.rollback();
            res.status(400).send({ success: false, data: null, message: 'Failed to update' });
        }
    } catch (error) {
        await t.rollback()
        apiErrorHandler(res, error, 'product');
    }
}


module.exports.deleteProduct = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (product) {
            await product.destroy({transaction: t});
            res.status(204).send();
        } else {
            res.status(404).send({ success: false, message: 'No product found' });
        }
    } catch (error) {
        apiErrorHandler(res, error, 'product');
    }
}