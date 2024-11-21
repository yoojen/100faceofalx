const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');


const connectDB = require('./Helpers/checkDB');
const UserRouter = require('./Routes/UserRouter');

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


app.use(UserRouter);

app.listen(PORT);