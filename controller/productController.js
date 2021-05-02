const Product = require('../model/product');


exports.addProduct = async (req, res, next) => {
    try {

        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            img: req.files.product_img.map(e => e.fileName),
            thumb: req.files.product_thumb.map(e => e.fileName),
            productType: req.body.type
        });
        await newProduct.save();
        return "Success";
    } catch (error) {
        console.log(error);
        return "Fail";
    }
}
exports.getAllProduct = async (offset, limit) => {
    try {
        return await Product.find().skip(offset).limit(limit);
    } catch (error) {
        console.log(error);
        throw error;
    }
}
exports.getTopByProperty = async (property, limit) => {
    try {
        return await Product.find().sort({
            [`${property}`]: -1
        }).limit(limit);
    } catch (error) {
        console.log(error);
        throw error;
    }
}