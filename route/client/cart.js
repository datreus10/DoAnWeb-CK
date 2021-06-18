const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../../model/product");
const {
    Cart,
    CartItem
} = require("../../model/cart");
const {
    auth
} = require("../../middleware/auth");


router.get("/", auth, async (req, res) => {
    if (req.userID) {
        res.render("./client/cart", {
            cart: req.user ?
                await Cart.findOne({
                    userId: req.userID,
                }).populate({
                    path: "items.itemId",
                    select: "_id name img price sizes",
                }) : undefined,
            isLogin: req.user ? req.userName : false,
            isAdmin: req.userRole == "admin" ? "Admin" : "",
            products: await Product.find().limit(8),
        });
    } else {
        res.redirect("/signin");
    }
});

// select product to checkout

// add product to cart
router.post("/product/:id", auth, async (req, res) => {
    if (req.userID) {
        const p = await Product.findById(req.params.id);
        const pSizeIndex = p.sizes.findIndex(element => element.name == req.body.size && element.quantity > 0)

        if (pSizeIndex > -1) {
            const cart = await Cart.findOne({
                userId: req.userID
            });
            let index = cart.items.findIndex(element => element.itemId.equals(p._id))
            if (index > -1 && cart.items[index].size == req.body.size) {
                cart.items[index].quantity = req.body.quantity > p.sizes[pSizeIndex].quantity ? p.sizes[pSizeIndex].quantity : req.body.quantity;
            } else {
                cart.items.push(await CartItem.create({
                    itemId: p._id,
                    quantity: req.body.quantity > p.sizes[pSizeIndex].quantity ? p.sizes[pSizeIndex].quantity : req.body.quantity,
                    size: req.body.size
                }));
            }
            await cart.save();
        }
        res.redirect("/cart");
    }
});

router.post("/remove", auth, async (req, res) => {
    if (req.userID) {
        const cart = await Cart.findOne({
            userId: req.userID
        });
        for (let i = 0; i < cart.items.length; i++) {
            if (cart.items[i].itemId.toString() == req.body.product) {
                cart.items.splice(i, 1);
                i--;
            }
        }
        await cart.save();
    }
    res.redirect("/cart");
});

module.exports = router;