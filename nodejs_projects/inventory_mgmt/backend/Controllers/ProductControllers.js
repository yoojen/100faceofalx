const { Product, Supplier, SpecialCustomer, Category } = require('../Models/models');
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
        console.log(error);
        apiErrorHandler(res, error, 'product');
    }
}

module.exports.addProduct = async (req, res) => {
    try {
        const formData = {
            name, description, price, quantity_in_stock, specialId, SupplierId,
            SpecialCustomerId, CategoryId, supplierName, supplierAddress
        } = req.body;
        if (!formData.SupplierId && !formData.supplierName) {
            res.status(400).send({ success: false, product: null, message: 'Please select supplier or create one' });
        }
        if (formData.SupplierId) {
            const supplier = await Supplier.findByPk(formData.SupplierId);
            if (!supplier) {
                res.status(400).send({ success: false, product: null, message: 'Supplier doesn\'t exist. Please create supplier' });
                return;
            } else {
                var product = await Product.create(formData);
            }
        } else if (formData.supplierName) {
            const supplier = await Supplier.create({ name: formData.supplierName, specialId: formData?.supplierAddress });
            formData.SupplierId = supplier.id;
        }
        var product = await Product.create(formData);
        
        if (product) {
            res.status(200).send({ success: true, product: product, message: 'Product added successfully' });
        } else {
            res.status(400).send({ success: false, product: null, message: 'Invalid input' });
        }
    } catch (error) {
        apiErrorHandler(res, error, 'product')
    }
}