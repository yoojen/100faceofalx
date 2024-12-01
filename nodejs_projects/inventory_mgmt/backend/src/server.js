const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const connectDB = require('./Helpers/checkDB');
const UserRouter = require('./Routes/UserRouter');
const TransactionRouter = require('./Routes/TransactionRouter');
const CategoryRouter = require('./Routes/CategoryRouter');
const ProductRouter = require('./Routes/ProductRouter');
const SupplierRouter = require('./Routes/SupplierRouter');
const verifyToken = require('./Midddlelware');

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


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
app.use(verifyToken);
app.use(TransactionRouter);
app.use(CategoryRouter);
app.use(ProductRouter);
app.use(SupplierRouter)
app.listen(PORT);