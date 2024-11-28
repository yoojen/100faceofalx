const { apiErrorHandler } = require('../Helpers/errorHandler');
const models = require('../Models/models');

const getUsers = async (req, res) => {
    try {
        const { User } = models;
        const users = await User.findAll();
        res.status(200).send({ success: true, data: users, message: 'Retrieved successfully' });
    } catch (error) {
        apiErrorHandler(res, error, 'user');
    }
}

const createUser = async (req, res) => {
    const FormData = { username, email, password, firstName, lastName } = req.body;
    try {
        const { User } = models;
        const user = await User.create(FormData);
        if (user) {
            res.status(201).send({ id: user.id, success: true, message: 'User Created Successfully' });
        } else {
            res.status(201).send({ id: null, success: false, message: 'Something went wrong' });
        }
    } catch (error) {
        if (error.errors[0].message) {
            var errorMsg = error.errors[0].message
        }
        res.status(201).send({ id: null, success: false, message: errorMsg});
    }
    
}


const getUserById = async (req, res) => {
    try {
        const { User, Stock } = models;
        const { username } = req.params;
        const user = await User.findOne({ where: { username: username }, include: Stock });
        
        if (user) res.send({ success: true, data: user, message: 'User found' });
        else res.send({ success: false, data: null, message: 'No user found' });
    } catch (error) {
        res.status(400).send({ success: false, data: null, message: 'Failed to load user' });
    }
}

module.exports = {
    getUsers,
    createUser,
    getUserById
};