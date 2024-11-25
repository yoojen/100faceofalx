const { Product, Supplier, SpecialCustomer, Category, InventoryTransaction } = require('../Models/models');
const { apiErrorHandler } = require('../Helpers/errorHandler');


module.exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                {
                    model: SpecialCustomer,
                    attributes: ['name']
                },
                {
                    model: Supplier,
                    attributes: ['name']
                }
            ]
        });
        res.status(200).send({ success: true, products: products, message: 'Retrieved successfully' });
    } catch (error) {
        apiErrorHandler(res, error, 'product');
    }
}

module.exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id, {
            include: [
                {
                    model: SpecialCustomer,
                    attributes: ['id', 'name']
                },
                {
                    model: Supplier,
                    attributes: ['id', 'name']
                }
            ]
        });
        res.status(200).send({ success: true, product: product, message: 'Retrieved successfully' });
    } catch (error) {
        apiErrorHandler(res, error, 'product');
    }
}

module.exports.searchProduct = async (req, res) => {
    try {
        const options = req.query;
        const product = await Product.findAll({
            where:  options,
            include: [
                {
                    model: SpecialCustomer,
                    attributes: ['name']
                },
                {
                    model: Supplier,
                    attributes: ['name']
                },
                {
                    model: Category,
                    attributes: ['id', 'name']
                }
            ]
        })
        res.status(200).send({ success: true, product: product, message: 'Retrieved successfully' });
    } catch (error) {
        apiErrorHandler(res, error, 'product');
    }
}

module.exports.createProduct = async (req, res) => {
    try {
        const formData = {
            name, description, price, quantity_in_stock, specialId, SupplierId,
            SpecialCustomerId, CategoryId, categoryName, supplierName, supplierAddress
        } = req.body;
        //If product exists
        if (await Product.findOne({ where: { name: formData.name } })) {
            res.status(400).send({ success: false, product: null, message: 'Create transaction instead' });
            return;
        }

        //Creation of supplier
        if (!formData.SupplierId && !formData.supplierName) {
            res.status(400).send({ success: false, product: null, message: 'Please select supplier or create one' });
            return;
        }
        if (formData.SupplierId) {
            const supplier = await Supplier.findByPk(formData.SupplierId);
            if (!supplier) {
                res.status(400).send({ success: false, product: null, message: 'Supplier doesn\'t exist. Please create supplier' });
                return;
            }
        } else if (formData.supplierName) {
            const supplier = await Supplier.create({ name: formData.supplierName, specialId: formData?.supplierAddress });
            formData.SupplierId = supplier.id;
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
        //Creating transaction
        var product = await Product.create(formData);
        const transaction = await InventoryTransaction.create({
            quantity: formData.quantity_in_stock,
            buying_price: formData.price,
            total_amount: formData.quantity_in_stock * formData.price,
            transaction_type: 'IN',
            ProductId: product.id
        })
        if (transaction) {
            if (product) {
                res.status(200).send({ success: true, product: product, message: 'Product added successfully' });
            } else {
                product.destroy();
                res.status(400).send({ success: false, product: null, message: 'Invalid input' });
            }
        } else {
            res.status(400).send({ success: false, product: null, message: 'Try again' });
        }
    } catch (error) {
        if (product) await product.destroy();
        apiErrorHandler(res, error, 'product')
    }
}