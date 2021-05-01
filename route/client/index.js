const express = require("express");
const router = express.Router();
const product = require("../../controller/productController");


router.get("/", async (req, res) => {
    res.render("./client/index", {
        lastedProducts: await product.getTopByProperty('createAt', 10),
        products: await product.getAllProduct(0, 8),
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
        products: await product.getAllProduct(offset, limit),
    });
});


module.exports = router;