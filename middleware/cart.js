const Product = require("../model/product");
const {
    Cart,
    CartItem
} = require("../model/cart");
const mongoose = require("mongoose");

const cartFillter = async (req, res, next) => {
    if (req.userID) {
        req.cart = await Cart.findOne({
            userId: req.userID
        })
    } else {
        if (req.session.cart) {
            const listItem = []

            for (let item of req.session.cart.items) {
                listItem.push(new CartItem({
                    itemId: mongoose.mongo.ObjectId(item.itemId),
                    size: item.size,
                    quantity: item.quantity
                }))
            }

            req.cart = new Cart({
                items: listItem
            })
        } else
            req.cart = new Cart();
    }
    next();
}

const addItemToCart = async (req, res, next) => {
    const p = await Product.findById(req.params.id);
    const pSizeIndex = p.sizes.findIndex(element => element.name == req.body.size && element.quantity > 0)

    if (pSizeIndex > -1) {
        const cart = req.cart
        let index = cart.items.findIndex(element => element.itemId.equals(p._id))
        if (index > -1 && cart.items[index].size == req.body.size) {
            let newQuantity = parseInt(req.body.quantity) + cart.items[index].quantity;
            if (newQuantity > p.sizes[pSizeIndex].quantity)
                cart.items[index].quantity = p.sizes[pSizeIndex].quantity;
            else
                cart.items[index].quantity = newQuantity;
        } else {
            cart.items.push(await CartItem.create({
                itemId: p._id,
                quantity: req.body.quantity > p.sizes[pSizeIndex].quantity ? p.sizes[pSizeIndex].quantity : req.body.quantity,
                size: req.body.size
            }));
        }
        if (req.userID) {
            await cart.save();
        } else {
            req.session.cart = cart;
        }
    }
    next();
}

module.exports = {
    cartFillter,
    addItemToCart
}