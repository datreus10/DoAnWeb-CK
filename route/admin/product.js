const express = require("express");
const router = express.Router();
const Product = require('../../model/product');
const {
    Cart
} = require('../../model/cart');

const ProductType = require('../../model/productType');
const helper = require('../helper');

const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

// Trang thêm sản phẩm
router.get('/add', async (req, res) => {
    res.render("./admin/addProduct", {
        productTypes: await ProductType.find(),
        msg: req.query.msg || '',
    });

})


const uploadMultiple = helper.upload.fields([{
    name: 'product_img',
    maxCount: 4
}])


router.post('/add', uploadMultiple, async (req, res, next) => {
    let msg = '';
    const listFileName = [];
    for (let file of req.files.product_img) {
        listFileName.push(file.filename);
        // const result = await helper.uploadFile(file)
        // await unlinkFile(file.path)
    }
    try {
        const description = req.body.description.trim().split('\n').map(e=>{
            const tmp = e.trim().split(':')
            return {
                key: tmp.length >0 ? tmp[0] : "",
                value: tmp.length >1 ? tmp[1] : "",
            }
        })

        const newProduct = new Product({
            name: req.body.name.trim(),
            description: description,
            img: listFileName,
            price: req.body.price.trim(),
            quantity: req.body.quantity,
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
        msg: req.query.msg || ''
    })
})
router.post('/', async (req, res) => {
    
    res.render("./admin/product", {
        products: await Product.find({
            name: {
                $regex: req.body.name.trim(),
                $options: 'i'
            },
            createdAt: {
                $lte: req.body.dayAfter,
                $gte: req.body.dayBefore
            }
        }).sort({
            createdAt: -1
        }),
    })
})

// Trang chi tiết
router.get('/:id', async (req, res) => {
    res.render('./admin/detailProduct', {
        product: await Product.findById(req.params.id),

    })
})
// update sản phẩm
router.get('/edit/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.render("./admin/editProduct", {
            product: product,
            productTypes: await ProductType.find(),
            msg: req.query.msg || '',
        });
    } catch {
        res.redirect('/admin')
    }

})
router.put('/edit/:id', uploadMultiple, async (req, res) => {

    let product

    try {
        product = await Product.findById(req.params.id)
        if (req.files.product_img != undefined) {
            const listFileName = [];
            for (let file of req.files.product_img) {
                listFileName.push(file.filename);
                const result = await helper.uploadFile(file)
                await unlinkFile(file.path)
            }
            product.img = listFileName
        }
        product.name = req.body.name
        product.description = req.body.description

        product.price = req.body.price
        product.sizes = [{
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
        }]
        product.productType = req.body.type

        await product.save()
        msg = "Update sản phẩm thành công";
        res.redirect(`/admin/product/edit/${product._id}?msg=` + msg);
    } catch (err) {
        console.log(err)
        //Kiem tra loi nhung da tao product thanh cong=> loi do save len db
        if (product != null) {
            res.render("./admin/editProduct", {
                product: product,
                productTypes: await ProductType.find(),
                msg: req.query.msg || '',
            });
        } else {
            redirect('/admin/product')
        }

    }
})
// xóa sản phẩm
router.delete('/delete/:id', async (req, res) => {
    let product
    try {
        product = await Product.findById(req.params.id)
        updateitems = []
        data = await Cart.find({
            "items.itemId": req.params.id
        })
        if (data) {
            data.forEach(async cart => {
                cart.items.forEach(item => {
                    if (item.itemId != req.params.id) {
                        updateitems.push(item)

                    }
                })
                cart.items = updateitems
                await cart.save()
            })
        }
        data = await Cart.find({
            "items.itemId": req.params.id
        })
        await product.remove()
        res.redirect('/admin/product')



    } catch (err) {
        console.log(err)
        if (product == null) {
            res.redirect('/admin/product')
        } else {

            res.redirect('/admin/product?msg=' + err)
        }
    }
})
module.exports = router