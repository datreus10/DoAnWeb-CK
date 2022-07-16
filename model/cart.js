const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    date: {
        type: Date,
        default: Date.now()
    },
});

itemSchema.virtual('total').get(function () {
    return this.quantity * this.itemId.price;
});

itemSchema.virtual('totalFormat').get(function () {
    return (this.quantity * this.itemId.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
});

const cartItem = mongoose.model('CartItem', itemSchema, 'CartItem');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [itemSchema],

}, {
    timestamps: true
});

cartSchema.virtual('total').get(function () {
    return this.items.reduce((total, item) => total + item.quantity * item.itemId.price, 0);
});

cartSchema.virtual('totalFormat').get(function () {
    const temp= this.items.reduce((total, item) => total + item.quantity * item.itemId.price, 0);
    return temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
});

const cart = mongoose.model('Cart', cartSchema, 'Cart');

module.exports = {
    CartItem: cartItem,
    Cart: cart
}