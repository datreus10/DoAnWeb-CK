const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        itemid: {
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
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema, 'Cart');