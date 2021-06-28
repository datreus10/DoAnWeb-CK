const express = require("express");
const router = express.Router();
const Product = require('../../model/product');
const User = require('../../model/user');
const {
    Cart
} = require('../../model/cart');
const {
    auth
} = require('../../middleware/auth')

const {
    cartFillter,
    addItemToCart,
    removeItemFromCart
} = require("../../middleware/cart")


router.get("/", auth, cartFillter, async (req, res) => {
    res.render("./client/index", {
        lastedProducts: await Product.find().sort({
            createAt: -1
        }).limit(10),
        products: await Product.find().limit(8),
        // isLogin: req.session.user ? req.session.user.name : false
        isAdmin: req.userRole == "admin" ? "Admin" : "",
        isLogin: req.userName
    });
});

// router.get("/login", async (req, res) => {
//     const user = await User.findOne({
//         name: "dat2"
//     });
//     req.session.user = user;

//     res.redirect("/");
// })

// router.get("/logout", async (req, res) => {
//     req.session.destroy();
//     res.redirect('/');
// })

// router.get("/register", async (req, res) => {
//     const user = await User.create({
//         name: "dat2"
//     });
//     await Cart.create({
//         userId: user.id,
//         items: []
//     })
//     res.redirect("/");
// })



module.exports = router;