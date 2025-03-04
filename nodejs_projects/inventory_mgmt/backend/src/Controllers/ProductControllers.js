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
        } = await paginate(req, Product, options = null, include = [Category]);
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
        const {
            name, description, quantity_in_stock, CategoryId, categoryName
        } = req.body;
        //If product exists
        console.log('Requested reached')
        if (await Product.findOne({ where: { name: name.trim() } })) {
            res.status(400).send({ success: false, error: 'Product already exists' });
            return;
        }

        //Creation of category
        if (!CategoryId && !categoryName) {
            res.status(400).send({ success: false, error: 'Please select category or create one' });
            return;
        }
        if (CategoryId) {
            const category = await Category.findByPk(CategoryId);
            if (!category) {
                res.status(400).send({ success: false, error: 'Category doesn\'t exist. Please create category' });
                return;
            }
        }
        else if (categoryName) {
            try {
                const category = await Category.create({ name: categoryName, });
                CategoryId = category.id;
            } catch (error) {
                apiErrorHandler(res, error, 'category');
            }
        }

        var product = await Product.create({ name, CategoryId, quantity_in_stock, description }, {
            transaction: t
        });
        if (product) {
            await t.commit();
            res.status(201).send({ success: true, data: product, message: 'Product added successfully' });
        } else {
            await t.rollback();
            res.status(400).send({ success: false, error: 'Invalid input' });
        }
    } catch (error) {
        console.log(error)
        await t.rollback();
        apiErrorHandler(res, error, 'product')
    }
}

module.exports.updateProduct = async (req, res) => {
    const t = await sequelize.transaction()
    try {
        const { id } = req.params;
        if (Object.keys(req.body).length < 1) {
            res.status(400).send({ success: false, error: 'Update parameters missing' });
            return;
        }
        const product = await Product.findOne({ where: { id: id } });
        if (!product) {
            res.status(400).send({ success: false, error: 'No product found' });
        }
        const affectedRows = await Product.update(req.body, { where: { id: id }, transaction: t });
        if (affectedRows[0] > 0) {
            await t.commit();
            res.status(200).send({ success: true, data: product, message: 'Updated successfully' });
        } else {
            await t.rollback();
            res.status(400).send({ success: false, error: 'Failed to update' });
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
            await product.destroy({ transaction: t });
            res.status(204).send();
        } else {
            res.status(404).send({ success: false, error: 'No product found' });
        }
    } catch (error) {
        apiErrorHandler(res, error, 'product');
    }
}