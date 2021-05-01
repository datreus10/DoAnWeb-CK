const express = require('express');
const app = express();
const dotenv = require('dotenv');
const db = require('./db/dbConfig');
dotenv.config();
db.dbConnect();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const indexRouter = require('./route/index');


app.use('/',indexRouter);


app.listen(app.get('port'), () => {
    console.log('Server has started and listening on port ' + app.get('port'));
});