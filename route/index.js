const express = require('express');
const router = express.Router();
const product = require('../controller/productController');
const ejs = require('ejs');

let offset = 0,
    limit = 4;

router.route('/')
    .get(async (req, res) => {
        if (req.query.loadMore) {
            res.status(200).send({
                products: await product.getAllProduct(offset, limit)
            })
            // res.render('partial/productCard', {
            //     products: await product.getAllProduct(offset, limit)
            // });
        } else {
            res.render('index', {
                lastedProducts: await product.getTopNewest(10),
                products: await product.getAllProduct(offset, limit)
            });
        }
    });
// .post(async (req, res) => {
//     offset += limit;
//     res.status(200).send({
//         lastedProducts: await product.getTopNewest(1),
//         allProducts: await product.getAllProduct(offset, limit)
//     });
// })

module.exports = router