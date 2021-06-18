const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const {
    Cart,
    CartItem
} = require("../../model/cart");



const Bill = require("../../model/bill");
const {
    auth
} = require('../../middleware/auth')

router.get('/', auth, async (req, res) => {
    if (req.user) {
        
        const listItem = []

        if(req.session.cart){
            for (let i = 0; i < req.session.cart.length; i++) {
                listItem.push(await CartItem.create({
                    itemId: mongoose.mongo.ObjectId(req.session.cart[i].itemId),
                    size: req.session.cart[i].size,
                    quantity: req.session.cart[i].quantity
                }))
            }
        }

        //i = await i.populate('itemId').execPopulate()


        let c = await Cart.create({
            userId: req.userID,
            items: listItem
        })

        c = await c.populate({
            path: 'items.itemId',
            select: '_id name img price'
        }).execPopulate()

        res.render('./client/checkout', {
            isAdmin: req.userRole == "admin" ? "Admin" : "",
            isLogin: req.userName,
            cart: c,

        })
    } else {
        res.redirect("/")
    }

});

router.post('/', auth, async (req, res) => {
    const listItem = JSON.parse(req.body["data"]).map(e => {
        return {
            itemId: e["product-checkbox"],
            quantity: e["quantity"],
            size: e["size"]
        }
    });
    req.session.cart = listItem;
    req.session.save();
    res.status(200).send({result: 'redirect', url:'/checkout'})
});

router.post('/thanh_toan', auth, async (req, res) => {
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