import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String
    },
    details: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    }
}, { timestamps: true })


productSchema.index({ 
    name:'text',
    description: 'text',
}, {
    weights: {
        name: 5,
        description: 1,
    }
})

const Product = mongoose.model('Product', productSchema);

export default Product;