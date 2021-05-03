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



module.exports = router;