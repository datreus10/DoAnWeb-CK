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
    size: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    },
});

itemSchema.virtual('total').get(function () {
    return this.quantity * this.itemId.price;
});

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

module.exports = mongoose.model('Cart', cartSchema, 'Cart');