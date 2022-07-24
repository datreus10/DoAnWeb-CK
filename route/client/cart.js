const express = require("express");
const router = express.Router();

const Product = require("../../model/product");
const {
    auth
} = require("../../middleware/auth");
const {
    cartFillter,addItemToCart,removeItemFromCart
} = require("../../middleware/cart")




router.get("/", auth, cartFillter, async (req, res) => {
    req.session.searchWord="";
    let cart = req.cart;
    cart = await cart.populate({
        path: 'items.itemId',
        select: '_id name img price quantity'
    }).execPopulate()

    res.render("./client/cart", {
        cart: cart,
        isLogin: req.user ? req.userName : false,
        isAdmin: req.userRole == "admin" ? "Admin" : "",
        products: await Product.find().limit(8),
        cartQnt : req.cart.items.length
    });

});

// select product to checkout

// add product to cart
router.post("/product/:id", auth, cartFillter,addItemToCart, (req, res) => {
    // res.redirect("/cart");
    res.redirect(req.get('referer'));
});

router.post("/remove", auth,cartFillter,removeItemFromCart, (req, res) => {
    res.status(200).send('');
});

module.exports = router;