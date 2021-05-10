const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session');
const dotenv = require('dotenv');
const db = require('./db/dbConfig');
dotenv.config();
db.dbConnect();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: '1234567abc',
    cookie: {
        maxAge: 60000
    }
}));

const apiRouter = require('./route/api');
const clientIndexRouter = require('./route/client/index');
const clientProductRouter = require('./route/client/product');
const clientCartRouter = require('./route/client/cart');
const clientCheckoutRouter = require('./route/client/checkout');
const adminIndexRouter = require('./route/admin/index');
const adminProductRouter = require('./route/admin/product');
const adminProductTypeRouter = require('./route/admin/productType');

app.use('/api', apiRouter);
app.use('/', clientIndexRouter);
app.use('/product', clientProductRouter);
app.use('/cart', clientCartRouter);
app.use('/checkout',clientCheckoutRouter);
app.use('/admin', adminIndexRouter);
app.use('/admin/product', adminProductRouter);
app.use('/admin/product/type', adminProductTypeRouter);


app.listen(app.get('port'), () => {
    console.log('Server has started and listening on port ' + app.get('port'));
});