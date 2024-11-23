const { apiErrorHandler } = require('../Helpers/errorHandler');
const { Category } = require('../Models/models');

module.exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({});
        res.status(200).send({ success: true, categories: categories, messaage: 'Retrieved successfully' });
    } catch (error) {
        apiErrorHandler(res, error, 'categories');
    }
}


module.exports.getCatgory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (category) {
            res.status(200).send({ success: true, category: category, message: 'Retrieved successfully' });
        } else {
            res.status(200).send({ success: false, category: null, message: 'No category found' });
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
            res.status(200).send({ success: true, category: category, message: 'Created successfully' });
        } else {
            res.status(400).send({ success: false, category: null, message: 'Failed to create category' });
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
            res.status(400).send({ success: true, category: updatedCategory, message: 'Updated successfully' });
        } else {
            res.status(400).send({ success: false, category: null, message: 'No category found' });
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
            res.status(400).send({ success: false, category: null, message: 'No category found' });
        }
    } catch (error) {
        apiErrorHandler(res, error, 'category')   
    }
}