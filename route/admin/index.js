const express = require("express");
const router = express.Router();
const Product = require('../../model/product');

router.get('/', async (req, res) => {

    res.render("./admin/index", {
        products: await Product.find().sort({
            createAt: -1
        }).limit(10),
        layout: './layout/adminLayout',
    })
})

module.exports = router