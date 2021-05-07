const express = require("express");
const router = express.Router();
const Cart = require("../../lib/Cart");

router.get('/', async (req, res) => {
    res.render("./client/cart", {
        cart: req.session.cart,
        isLogin : req.session.user? req.session.user.name : false,
        layout: './layout/clientLayout'
    });
})

// add product to cart
router.post('/:id', async (req, res) => {
    if (req.session.user) {
        await Cart.addToCart(req.session.user._id, req.params.id,
            req.body.quantity, req.body.size, req.session.cart);

    }
    res.redirect('/cart');
})




module.exports = router