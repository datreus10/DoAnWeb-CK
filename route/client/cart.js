const express = require("express");
const router = express.Router();

const Product = require("../../model/product");
const Cart = require("../../model/cart");
const {
    auth
} = require('../../middleware/auth')
router.get('/', auth, async (req, res) => {
    if (req.userID) {
        res.render("./client/cart", {
            cart: req.user ? await Cart.findOne({
                userId: req.userID
            }).populate({
                path: 'items.itemId',
                select: '_id name img price sizes'
            }) : undefined,
            isLogin: req.user ? req.userName : false,
            isAdmin: req.userRole == "admin" ? "Admin" : "",
            products: await Product.find().limit(8),
        });
    } else {
        res.redirect('/signin');
    }

})


// select product to checkout



// add product to cart
router.post('/product/:id', auth, async (req, res) => {
    if (req.user) {
        // viet code update (neu co san pham va trung size khac so luong thi 
        // update so luong, ko thi add vo mang)

        await Cart.updateOne({
            userId: req.userID,
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
            userId: req.userID,
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

router.post('/remove', auth, async (req, res) => {
    if (req.userID && req.body.product) {
        const temp = typeof req.body.product === "string" ? [{
            _id: req.body.product
        }] : req.body.product.map(e => ({
            _id: e
        }));
        await Cart.updateOne({
            userId: req.userID
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