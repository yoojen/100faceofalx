const express = require('express');
const dotenv = require('dotenv');

const sequelize = require('./Config/db.config');
const connectDB = require('./Helpers/checkDB');

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;


app.get('/status', (req, res) => {
    return res.status(200).send({ status: 'OK', success: true });
})

app.get('/db-status', async (req, res) => {
    const connected = await connectDB();
    if (connected) {
        return res.status(200).send({ status: 'OK', success: true })
    } else {
        return res.status(400).send({ status: 'BAD', success: false })
   }
})

app.listen(PORT);