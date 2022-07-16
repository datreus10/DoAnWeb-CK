const mongoose = require("mongoose")
const Product = require('./product')
const productTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    }
});
 //Dung next de ngan can viet xoa loai sp
productTypeSchema.pre('remove',function(next){
    Product.find({productType:this.id},(err,products )=>{
        if(err){
            next(err)
        }else if( products.length > 0){
            next(new Error(`Loại sản phẩm: "${this.name}" vẫn còn sản phẩm`))
        }else{
            next()
        }
    })
})


module.exports = mongoose.model('ProductType', productTypeSchema,'ProductType');