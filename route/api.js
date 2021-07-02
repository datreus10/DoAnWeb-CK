const express = require("express");
const router = express.Router();
const Product = require('../model/product');

router.get('/loadMore', async (req, res) => {
    let {
        offset,
        limit
    } = req.query;
    limit = parseInt(limit) || 8;
    offset = parseInt(offset) * limit || 0;
    const products = await Product.find().skip(offset).limit(limit);
    res.status(200).send({
        products: products,
    });
})



module.exports = router