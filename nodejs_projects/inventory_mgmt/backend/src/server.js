const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
var cors = require('cors')
const cookieParser = require('cookie-parser');


const connectDB = require('./Helpers/checkDB');
const TransactionRouter = require('./Routes/TransactionRouter');
const CategoryRouter = require('./Routes/CategoryRouter');
const ProductRouter = require('./Routes/ProductRouter');
const SupplierRouter = require('./Routes/SupplierRouter');
const AuthRouter = require('./Routes/UserRouter');

dotenv.config();
const corsConfig = { origin: 'http://localhost:3000', credentials: true, maxAge: 7 * 24 * 60 * 60 * 1000 };

const app = express()
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsConfig));
app.use(cookieParser());


app.use(async (req, res, next) => {
    const connected = await connectDB();
    if (connected) {
        console.log('DB connected');
        next();
    } else {
        throw new Error('Error while connecting')
    }
});

app.get('/status', (req, res) => {
    return res.status(200).send({ status: 'OK', success: true });
})

app.use(AuthRouter);
app.use(TransactionRouter);
app.use(CategoryRouter);
app.use(ProductRouter);
app.use(SupplierRouter)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});