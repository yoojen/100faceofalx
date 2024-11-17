const sequelize = require('../Config/db.config');

async function connectDB() {
    try {
        await sequelize.authenticate()
        return true
    } catch (error) {
        return false
    }
}

module.exports = connectDB;