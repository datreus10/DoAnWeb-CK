const express = require("express");
const router = express.Router();
const Product = require('../../model/product');
const User = require('../../model/user');
const Cart = require('../../model/cart');

router.get("/", async (req, res) => {
    res.render("./client/index", {
        lastedProducts: await Product.find().sort({
            createAt: -1
        }).limit(10),
        products: await Product.find().limit(8),
        isLogin: req.session.user ? req.session.user.name : false,
        layout: './layout/clientLayout'
    });
});

router.get("/login", async (req, res) => {
    const user = await User.findOne({
        name: "test"
    });
    req.session.user = user;
    
    res.redirect("/");
})

router.get("/logout", async (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

router.get("/register", async (req, res) => {
    const user = await User.create({
        name: "test"
    });
    await Cart.create({
        userId: user.id,
        items: []
    })
    res.redirect("/");
})



module.exports = router;