const { Product, Supplier, SpecialCustomer, Category, InventoryTransaction } = require('../Models/models');
const { apiErrorHandler } = require('../Helpers/errorHandler');
const sequelize = require('../Config/db.config');


module.exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({});
        res.status(200).send({ success: true, products: products, message: 'Retrieved successfully' });
    } catch (error) {
        apiErrorHandler(res, error, 'product');
    }
}

module.exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        res.status(200).send({ success: true, product: product, message: 'Retrieved successfully' });
    } catch (error) {
        apiErrorHandler(res, error, 'product');
    }
}

module.exports.searchProduct = async (req, res) => {
    try {
        const options = req.query;
        const product = await Product.findAll({
            where: options
        })
        res.status(200).send({ success: true, product: product, message: 'Retrieved successfully' });
    } catch (error) {
        apiErrorHandler(res, error, 'product');
    }
}

module.exports.createProduct = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const formData = {
            name, description, price, quantity_in_stock,
            SpecialCustomerId, CategoryId, categoryName
        } = req.body;
        //If product exists
        if (await Product.findOne({ where: { name: formData.name } })) {
            res.status(400).send({ success: false, product: null, message: 'Create transaction instead' });
            return;
        }

        //Creation of category
        if (!formData.CategoryId && !formData.categoryName) {
            res.status(400).send({ success: false, product: null, message: 'Please select category or create one' });
            return;
        }
        if (formData.CategoryId) {
            const category = await Category.findByPk(formData.CategoryId);
            if (!category) {
                res.status(400).send({ success: false, product: null, message: 'Category doesn\'t exist. Please create category' });
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
            res.status(200).send({ success: true, product: product, message: 'Product added successfully' });
        } else {
            await t.rollback();
            res.status(400).send({ success: false, product: null, message: 'Invalid input' });
        }
    } catch (error) {
        await t.rollback();
        apiErrorHandler(res, error, 'product')
    }
}

//When adding product I'll change behavior
module.exports.updateProduct = async (req, res) => {
    const t = await sequelize.transaction()
    try {
        const { id } = req.params;
        if (Object.keys(req.body).length < 1) {
            res.status(400).send({ success: false, product: null, message: 'Update parameters missing' });
            return;
        }
        const product = await Product.findOne({ where: { id: id } });
        if (!product) {
            res.status(400).send({ success: false, product: null, message: 'No product found' });
        }
        const affectedRows = await Product.update(req.body, { where: { id: id }, transaction: t });
        if (affectedRows[0] > 0){
            await t.commit();
            res.status(200).send({ success: true, product: product, message: 'Updated successfully' });
        } else {
            await t.rollback();
            res.status(200).send({ success: false, product: null, message: 'Failed to update' });
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
            res.status(204).send({ success: true, message: 'Deleted successfully' });
        } else {
            res.status(404).send({ success: false, message: 'No product found' });
        }
    } catch (error) {
        apiErrorHandler(res, error, 'product');
    }
}