const express = require("express");
const router = express.Router();
const Product = require("../../controller/productController");

router.get('/', async (req, res) => {

    res.render("./admin/index", {
        products: await Product.getTopByProperty('createAt',10),
        layout: './layout/adminLayout',
    })
})

module.exports = router