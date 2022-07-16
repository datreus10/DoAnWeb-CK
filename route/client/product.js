const express = require("express");
const router = express.Router();
const Product = require('../../model/product');
const jwt = require('jsonwebtoken');
const {
    auth
} = require('../../middleware/auth')
const {
    cartFillter
} = require("../../middleware/cart")


router.get('/:id', auth,cartFillter, async (req, res) => {
    req.session.searchWord="";
    const p = await Product.findById(req.params.id);

    res.render("./client/product", {
        product: await Product.findById(req.params.id),
        products: await Product.find().limit(8),
        conHang : p.quantity>0,
        isAdmin: req.userRole == "admin" ? "Admin" : "",
        isLogin: req.userName,
        cartQnt : req.cart.items.length
    })

})



module.exports = router