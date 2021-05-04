const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
    XL: {
        type: Number,
        min: 0,
        max: 200,
        default: 0
    },
    L: {
        type: Number,
        min: 0,
        max: 200,
        default: 0
    },
    M: {
        type: Number,
        min: 0,
        max: 200,
        default: 0
    },
    S: {
        type: Number,
        min: 0,
        max: 200,
        default: 0
    },
    XS: {
        type: Number,
        min: 0,
        max: 200,
        default: 0
    },
})

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    img: [{
        type: String,
        required: true
    }],
    price: {
        type: Number,
        required: true
    },
    sizes: sizeSchema,
    productType: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ProductType'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema, 'Product');