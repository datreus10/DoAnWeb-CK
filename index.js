import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path'
import home from './routes/home.js';
import addProduct from './routes/addProduct/addProduct.js';
// import deletePost from './routes/addProduct/delete.js';
// import update from './routes/addProduct/update.js';
import auth from './routes/auth/auth.js'
import Product from './routes/Product/Product.js';
import Customer  from './routes/Customer/Customer.js';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';



const app = express();


app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
var publicDir=path.join(__dirname,'/public/');
app.use(express.static(publicDir));



app.set('view engine', 'ejs');

app.use('/', home);
app.use('/', auth)
// app.use('/', update);
app.use('/', Customer)
app.use('/', addProduct);
// app.use('/', deletePost);
app.use('/', Product);





const CONNECTION_URL = 'mongodb+srv://Project_NodeJS:Turbo360@cluster0.qjs5j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const PORT = process.env.PORT|| 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);



