const { Sequelize } = require("sequelize");
const dotenv = require('dotenv');

dotenv.config();
let sequelize = new Sequelize('inventory_mgmt', 'root', process.env.DATABASE_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    logging: false
});

module.exports = sequelize;