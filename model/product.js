const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
    sizeName: String,
    quantity: Number,
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
    sizes: [{
        name:String,
        quantity:Number
    }],
    productType: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ProductType'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema, 'Product');