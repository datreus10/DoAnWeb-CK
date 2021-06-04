const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

exports.dbConnect = () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = mongoose.connection;
    db.once("open", () => {
        console.log("Successfully connected to MongoDB using Mongoose!");
    });
}