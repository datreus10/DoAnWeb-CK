const express = require("express");
const router = express.Router();
const Product = require('../../model/product');

const ProductType = require('../../model/productType');
const helper = require('../helper');

// Trang thêm sản phẩm
router.get('/add', async (req, res) => {
    res.render("./admin/addProduct", {
        productTypes: await ProductType.find(),
        msg: req.query.msg || '',
        layout: './layout/adminLayout',
    });
})


const uploadMultiple = helper.upload.fields([{
    name: 'product_img',
    maxCount: 4
}])


router.post('/add', uploadMultiple, async (req, res, next) => {
    let msg = '';
    try {
        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            img: req.files.product_img.map(e => e.filename),
            price: req.body.price,
            sizes: [{
                name: 'XL',
                quantity: req.body.XL
            }, {
                name: 'L',
                quantity: req.body.L
            }, {
                name: 'M',
                quantity: req.body.M
            }, {
                name: 'S',
                quantity: req.body.S
            }, {
                name: 'XS',
                quantity: req.body.XS
            }],
            productType: req.body.type
        });
        await newProduct.save();


        msg = "Thêm sản phẩm thành công";

    } catch (error) {
        console.log(error);
        msg = "Thêm sản phẩm thất bại";
    }
    res.redirect('/admin/product/add?msg=' + msg);
})

// Trang sản phẩm
router.get('/', async (req, res) => {
    res.render("./admin/product", {
        products: await Product.find().sort({
            createAt: -1
        }),
        layout: './layout/adminLayout',
    })
})
router.post('/', async (req, res) => {
    res.render("./admin/product", {
        products: await Product.find({
            name: {
                $regex: req.body.name.trim(),
                $options: 'i'
            },
            createAt: {
                $lte: req.body.dayAfter,
                $gte: req.body.dayBefore
            }
        }).sort({
            createAt: -1
        }),
        layout: './layout/adminLayout',
    })
})

// Trang chi tiết
router.get('/:id', async (req, res) => {
    res.render('./admin/detailProduct', {
        product: await Product.findById(req.params.id),
        layout: './layout/adminLayout'
    })
})

module.exports = router