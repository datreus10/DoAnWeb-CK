const helper = require('./helper');
const express = require("express");
const router = express.Router();
const Product = require('../model/product');

router.get('/img/:id', async (req, res) => {
    const widthStr = req.query.width;
    const heightStr = req.query.height;
    const format = req.query.format;
    let width, height;
    if (widthStr) {
        width = parseInt(widthStr);
    }
    if (heightStr) {
        height = parseInt(heightStr);
    }
    res.type(`image/${ format || 'png' }`);
    helper.resize(req.params.id, format, width, height).pipe(res);
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