const mongoose = require('mongoose');
const helper = require('../route/helper');
const Cart = require('./cart')
const Bill = require('./bill')
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
    getters: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

productSchema.virtual('fileLinks').get(function () {
    return this.img.map(e => helper.getFileLink(e));
});

productSchema.virtual('priceFormat').get(function () {
    return this.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
});
// kiểm tra ràng buộc khi xóa sp với giỏ hàng và hóa đơn
// productSchema.pre('remove',async function(next){
//     try{
//         existProductCart = await Cart.find({
//             'items.itemId':this.id
//         })
//         existProductBill = await Bill.find({
//             'items.itemId':this.id
//         })
//         if(existProductCart ){
//             next(new Error(`Sản phẩm: "${this.name}"  đã có trong giỏ hàng`))
//         }
//         else if( existProductBill){
//             next(new Error(`Sản phẩm: "${this.name}"  đã có trong hóa đơn`))
//         }
//         else{
//             next()
//         }
//     }
//     catch(err){
//         next(err)
//     }
   
// })


module.exports = mongoose.model('Product', productSchema, 'Product');