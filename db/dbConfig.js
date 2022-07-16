const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session')
const MongoStore = require('connect-mongo')
dotenv.config();

exports.dbConnectAndCreateSession = () => {
    const clientP = mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(m => m.connection.getClient());



    const db = mongoose.connection;
    db.once("open", () => {
        console.log("Successfully connected to MongoDB using Mongoose!");
    });

    return session({
        resave: false,
        saveUninitialized: false,
        secret: '1234567abc',
        cookie: {
            maxAge: 180 * 60 * 1000 // 3 hours
        },
        store: MongoStore.create({
            clientPromise: clientP
        })
    })
}