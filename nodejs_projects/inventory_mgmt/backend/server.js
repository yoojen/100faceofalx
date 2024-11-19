const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');


const sequelize = require('./Config/db.config');
const connectDB = require('./Helpers/checkDB');
const models = require('./Models/models');

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(async (req, res, next) => {
    const connected = await connectDB();
    if (connected) {
        next();
    } else {
        throw new Error('Error while connecting')
   }
});

app.get('/status', (req, res) => {
    return res.status(200).send({ status: 'OK', success: true });
})

app.use('/db-status', async (req, res) => {
    const connected = await connectDB();
    if (connected) {
        return res.status(200).send({ status: 'OK', success: true })
    } else {
        return res.status(400).send({ status: 'BAD', success: false })
   }
})

app.get('/users', (req, res) => {
    const { User } = models;
    const users = User.findAll();
    res.status(200).send(users)
})
app.post('/create-user', (req, res) => {
    const { username, email, password, firstName, lastName } = req.body;
    console.log(username, email, password, firstName, lastName)

    res.status(201).send({ status: 'OK', success: true });
})

app.listen(PORT);