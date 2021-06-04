const express = require("express");
const router = express.Router();
const ProductType = require('../../model/productType');

router.get('/add', async (req, res) => {
    res.render("./admin/addProductType", {
        msg: req.query.msg || '',
    });
})

router.post('/add', async (req, res) => {
    let msg = '';
    try {
        if (ProductType.findOne({
                name: req.body.name.trim()
            }))
            msg = "Tên loại sản phẩm đã tồn tại";
        else {
            const newProductType = new ProductType({
                name: req.body.name
            });
            await newProductType.save();
            msg = "Thêm loại sản phẩm thành công";
        }
    } catch (error) {
        console.log(error);
        msg = "Thêm loại sản phẩm thất bại";
    }
    res.redirect('/admin/product/type/add?msg=' + msg);
})

module.exports = router