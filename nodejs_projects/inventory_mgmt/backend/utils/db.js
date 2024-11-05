import { Sequelize } from "sequelize";

const sequelize = new Sequelize('inventory_mgm', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});


(async function () {
    try {
        await sequelize.authenticate()
        console.log("connected successfully");
    } catch (error) {
        console.log(new Error("failed to connect to db"))
    }
}())

export default sequelize;