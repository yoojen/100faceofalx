const apiErrorHandler = require('../Helpers/errorHandler');
const paginate = require('../Helpers/paginate');
const { Category, Product } = require('../Models/models');

module.exports.getCategories = async (req, res) => {
    try {
        const {
            rows,
            count,
            totalPages,
            currentPage
        } = await paginate(req = req, model = Category, options = null, include = [Product]);

        res.status(200).send({
            success: true,
            data: rows,
            totalItems: count,
            totalPages: totalPages,
            currentPage: currentPage,
            messaage: 'Retrieved successfully'
        });
    } catch (error) {
        apiErrorHandler(res, error, 'categories');
    }
}


module.exports.getCatgory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id, { include: [Product] });
        if (category) {
            res.status(200).send({ success: true, data: category, message: 'Retrieved successfully' });
        } else {
            res.status(200).send({ success: false, data: null, message: 'No category found' });
        }
    } catch (error) {
        apiErrorHandler(res, error, 'category')   
    }
}


module.exports.createCategory = async (req, res) => {
    try {
        const formData = { name } = req.body;
        const category = await Category.create(formData);
        if (category) {
            res.status(200).send({ success: true, data: category, message: 'Created successfully' });
        } else {
            res.status(400).send({ success: false, data: null, message: 'Failed to create category' });
        }
    } catch (error) {
        apiErrorHandler(res, error, 'category')
    }
}

module.exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (category) {
            const updatedCategory = await Category.update(req.body, {
                where: {
                    id: id
                }
            });
            res.status(400).send({ success: true, data: updatedCategory, message: 'Updated successfully' });
        } else {
            res.status(400).send({ success: false, data: null, message: 'No category found' });
        }
    } catch (error) {
        apiErrorHandler(res, error, 'category');
    }
}


module.exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (category) {
            await category.destroy();
            res.status(204).send();
        } else {
            res.status(400).send({ success: false, data: null, message: 'No category found' });
        }
    } catch (error) {
        apiErrorHandler(res, error, 'category')   
    }
}