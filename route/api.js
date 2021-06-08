const helper = require('./helper');
const express = require("express");
const router = express.Router();
const Product = require('../model/product');

router.get('/img/top3', async (req, res) => {
    res.send({
        "img": await Product.find().limit(3)
    });
})

router.get('/loadMore', async (req, res) => {
    let {
        offset,
        limit
    } = req.query;
    limit = parseInt(limit) || 8;
    offset = parseInt(offset) * limit || 0;
    res.status(200).send({
        products: await Product.find().skip(offset).limit(limit),
    });
})

module.exports = router