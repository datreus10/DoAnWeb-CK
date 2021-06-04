const mongoose = require('mongoose');
const helper = require('../route/helper');

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
        name: String,
        quantity: Number
    }],
    productType: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ProductType'
    },
}, {
    timestamps: true,
    getters: true
});

productSchema.virtual('fileLinks').get(function () {
    return this.img.map(e => helper.getFileLink(e));
});


module.exports = mongoose.model('Product', productSchema, 'Product');