const express = require("express");
const router = express.Router();
const Product = require('../../model/product');

router.get('/:id',async (req, res) => {
    res.render("./client/product", {
        product : await Product.findById(req.params.id),
        products : await Product.find().limit(8),
        layout: './layout/clientLayout'
    });
})

// add product to cart
router.post('/:id',async (req, res) => {
    res.render("./client/cart", {
        layout: './layout/clientLayout'
    });
    
})

module.exports = router