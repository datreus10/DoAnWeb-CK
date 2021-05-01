const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
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

const clientIndexRouter = require('./route/client/index');
const adminIndexRouter = require('./route/admin/index');


app.use('/',clientIndexRouter);
app.use('/admin',adminIndexRouter);


app.listen(app.get('port'), () => {
    console.log('Server has started and listening on port ' + app.get('port'));
});