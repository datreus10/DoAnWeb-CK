const express = require("express");
const router = express.Router();
const Product = require('../../model/product');


router.get("/", async (req, res) => {
    res.render("./client/index", {
        lastedProducts: await Product.find().sort({
            createAt: -1
        }).limit(10),
        products: await Product.find().limit(8),
        layout: './layout/clientLayout'
    });
});


router.get("/index/loadMore", async (req, res) => {
    let {
        offset,
        limit
    } = req.query;
    limit = parseInt(limit) || 8;
    offset = parseInt(offset) * limit || 0;
    res.status(200).send({
        products: await Product.find().skip(offset).limit(limit),
    });
});


module.exports = router;