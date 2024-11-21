const models = require('../Models/models');


const getUsers = (req, res) => {
    const { User } = models;
    const users = User.findAll();
    res.status(200).send(users)
}

const createUser = (req, res) => {
    const { username, email, password, firstName, lastName } = req.body;
    console.log(username, email, password, firstName, lastName)

    res.status(201).send({ status: 'OK', success: true });
}

module.exports = {
    getUsers,
    createUser
};