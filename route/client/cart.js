const express = require("express");
const router = express.Router();

const Product = require("../../model/product");
const Cart = require("../../model/cart");

router.get('/', async (req, res) => {
    res.render("./client/cart", {
        cart: req.session.user ? await Cart.findOne({
            userId: req.session.user._id
        }).populate({
            path: 'items.itemId',
            select: '_id name img price'
        }) : undefined,
        isLogin: req.session.user ? req.session.user.name : false,
        products: await Product.find().limit(8),
        layout: './layout/clientLayout'
    });
})

// add product to cart

router.post('/product/:id', async (req, res) => {
    if (req.session.user) {

        // viet code update (neu co san pham va trung size khac so luong thi update so luong, ko thi add vo mang)
        await Cart.updateOne({
            items: {
                "$not": {
                    "$elemMatch": {
                        itemId: req.params.id,
                        size: req.body.size
                    }
                }
            }
        }, {
            $addToSet: {
                items: {
                    itemId: req.params.id,
                    size: req.body.size,
                    quantity: req.body.quantity
                }
            }
        });

        await Cart.updateOne({
            "items.size": req.body.size,
            "items.itemId": req.params.id
        }, {
            $set: {
                "items.$.quantity": req.body.quantity
            }
        });
    }
    res.redirect('/cart');
})

router.post('/remove', async (req, res) => {
    if (req.session.user && req.body.product) {
        const temp = typeof req.body.product === "string" ? [{
            _id: req.body.product
        }] : req.body.product.map(e => ({
            _id: e
        }));
        await Cart.updateOne({
            userId: req.session.user._id
        }, {
            $pull: {
                "items": {
                    "$or": temp
                }
            }
        }, {
            safe: true,
            upsert: true
        })
    }
    res.redirect('/cart');

})



module.exports = router