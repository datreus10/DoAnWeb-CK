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

module.exports = router