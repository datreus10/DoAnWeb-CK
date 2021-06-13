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
    }
});



const billSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [itemSchema],
    dateOrder: {
        type: Date,
        default: Date.now()
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    total: {
        type: Number
    },
    address: {
        type: String
    },
    phone: {
        type: String
    }
});



module.exports = mongoose.model('Bill', billSchema, 'Bill');