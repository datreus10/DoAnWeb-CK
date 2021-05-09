const express = require("express");
const router = express.Router();
const Product = require('../../model/product');

router.get('/:id',async (req, res) => {
    res.render("./client/product", {
        product : await Product.findById(req.params.id),
        products : await Product.find().limit(8),
        isLogin : req.session.user? req.session.user.name : false,
        layout: './layout/clientLayout'
    });
})



module.exports = router