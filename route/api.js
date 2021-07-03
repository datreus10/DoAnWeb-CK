const express = require("express");
const router = express.Router();
const Product = require('../model/product');
const {
    getquery
} = require("../middleware/getquery")
router.get('/loadMore',getquery, async (req, res) => {
    let {
        offset,
        limit
    } = req.query;
    const getquery=req.getquery
    limit = parseInt(limit) || 8;
    offset = parseInt(offset) * limit || 0;
    if(getquery)
    {
        const products = await Product.find(getquery).skip(offset).limit(limit);
        res.status(200).send({
            products: products,
        });
    }
    else
    {
        const products = await Product.find().skip(offset).limit(limit);
        res.status(200).send({
            products: products,
        });
    }

})



module.exports = router