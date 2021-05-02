const express = require("express");
const router = express.Router();
const ProductType = require('../../controller/productTypeController');

router.get('/add', async (req, res) => {
    res.render("./admin/addProductType", {
        msg: req.query.msg || '',
        layout: './layout/adminLayout',
    });
})

router.post('/add', async (req, res) => {
    const msg = await ProductType.addProductType(req, res);
    res.redirect('/admin/product/type/add?msg=' + msg);
})

module.exports = router