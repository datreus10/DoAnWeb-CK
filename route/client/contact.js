const {auth} = require ('../../middleware/auth')
const express = require("express");
const router = express.Router();
const Product = require('../../model/product');

router.get('/contact', auth,async (req, res) => {
    res.render("./client/contact", {
        isLogin: req.user ? req.userName : false,
        isAdmin: req.userRole=="admin"? "Admin": "",
        products: await Product.find().limit(8),
    });
})

module.exports = router;