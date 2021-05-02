const express = require("express");
const router = express.Router();
const ProductType = require('../../controller/productTypeController');
const Product = require('../../controller/productController');
const helper = require('../helper');

// Proccess Section
const uploadMultiple = helper.upload.fields([{
    name: 'product_img',
    maxCount: 4
}, {
    name: 'product_thumb',
    maxCount: 4
}])

const proccessImg = async (req, res, next) => {
    for (const item of req.files.product_img) {
        item.fileName = await helper.resizeAndSaveTo(item, 755, 500, 'public/img/product/main');
    }
    for (const item of req.files.product_thumb) {
        item.fileName = await helper.resizeAndSaveTo(item, 116, 116, 'public/img/product/thumb');
    }
    next();
}



// Router Section
router.get('/add', async (req, res) => {
    res.render("./admin/addProduct", {
        productTypes: await ProductType.getAllProductTypes(),
        msg: req.query.msg || '',
        layout: './layout/adminLayout',
    });
})


router.post('/add', uploadMultiple, proccessImg, async (req, res, next) => {
    const msg = await Product.addProduct(req, res);
    res.redirect('/admin/product/add?msg=' + msg);
})





module.exports = router