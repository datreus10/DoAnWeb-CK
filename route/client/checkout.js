const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const {
    Cart,
    CartItem
} = require("../../model/cart");

const Product = require("../../model/product");

const Bill = require("../../model/bill");
const {
    auth
} = require('../../middleware/auth')

router.get('/', auth, async (req, res) => {
    if (req.user) {
        const listItem = []
        if(req.session.cart){
            for(let item of req.session.cart){
                listItem.push(await CartItem.create({
                    itemId: mongoose.mongo.ObjectId(item.itemId),
                    size: item.size,
                    quantity: item.quantity
                }))
            }
        }

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

        // tao bill
        const bill = new Bill({
            userId: cart.userId,
            items: cart.items,
            total: cart.total,
            address: req.body.address,
            phone: req.body.phone
        });
        await bill.save();

        // giam so luong san pham theo size
        for(let item of cart.items) {
            // const y  = await Product.findOne({_id: item.itemId.id,'sizes.name':item.size});
            await Product.updateOne({_id: item.itemId.id,'sizes.name':item.size},{$inc: {'sizes.$.quantity': -item.quantity}})
        }

        await Cart.updateOne({_id: cart._id}, {$set: {"items": []}});
        
        res.redirect("/");
    } else {
        res.redirect("/");
    }

})

module.exports = router;