const express = require("express");
const router = express.Router();
//const mongoose = require("mongoose");
const Product = require("../../model/product");
const {
    Cart,
    CartItem
} = require("../../model/cart");
const {
    auth
} = require("../../middleware/auth");
const {
    cartFillter,addItemToCart
} = require("../../middleware/cart")




router.get("/", auth, cartFillter, async (req, res) => {

    let cart = req.cart;
    cart = await cart.populate({
        path: 'items.itemId',
        select: '_id name img price sizes'
    }).execPopulate()

    res.render("./client/cart", {
        cart: cart,
        isLogin: req.user ? req.userName : false,
        isAdmin: req.userRole == "admin" ? "Admin" : "",
        products: await Product.find().limit(8),
    });

});

// select product to checkout

// add product to cart
router.post("/product/:id", auth, cartFillter,addItemToCart, (req, res) => {
    res.redirect("/cart");
});

router.post("/remove", auth, async (req, res) => {
    if (req.userID) {
        const cart = await Cart.findOne({
            userId: req.userID
        });

        for (let i = 0, j = 0; i < cart.items.length; i++) {
            if (cart.items[i].itemId.toString() == req.body.data[j].product) {
                cart.items.splice(i, 1);
                i--;
                j++;
            }
        }


        await cart.save();
    }
    res.status(200).send('');
});

module.exports = router;