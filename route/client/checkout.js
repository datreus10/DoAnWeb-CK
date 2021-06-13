const express = require("express");
const router = express.Router();
const Cart = require("../../model/cart");
const Bill = require("../../model/bill");
const {
    auth
} = require('../../middleware/auth')

router.get('/', auth, async (req, res) => {
    if (req.user) {
        res.render('./client/checkout', {
            isLogin: req.userName,
            cart: await Cart.findOne({
                userId: req.userID
            }).populate({
                path: 'items.itemId',
                select: '_id name img price'
            }),
        })
    } else {
        res.redirect("/")
    }

})
router.post('/', auth, async (req, res) => {
    if (req.user) {
        console.log("Hello");
        const cart = await Cart.findOne({
            userId: req.userID
        }).populate({
            path: 'items.itemId',
            select: '_id name price'
        });
        const bill = new Bill({
            userId: cart.userId,
            items: cart.items,
            total: cart.total,
            address: req.body.address,
            phone: req.body.phone
        });
        await bill.save();
        await Cart.updateOne({
            _id: cart._id
        }, {
            $set: {
                "items": []
            }
        })
        res.redirect("/");
    } else {
        res.redirect("/");
    }

})

module.exports = router;