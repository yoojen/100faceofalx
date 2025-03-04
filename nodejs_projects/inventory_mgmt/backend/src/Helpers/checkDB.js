const sequelize = require('../Config/db.config');
const models = require('../Models/models');

async function connectDB(req, res, next) {
    try {
        await sequelize.authenticate()
        return true
    } catch (error) {
        return false
    }
}

module.exports = connectDB;