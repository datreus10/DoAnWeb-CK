const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // publishDate:{
    //     type: Date,
    //     required: true
    // },
    price: {
        type: Number,
        required: true
    },
    createAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    img: {
        type: String,
        required: true,
        default: './img/product/1.jpg'
    },
    productType: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ProductType'
    },
});

module.exports = mongoose.model('Product', productSchema, 'Product');