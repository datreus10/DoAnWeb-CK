const Product = require('../model/product');

exports.addProduct = async (req, res, next) => {
    // try {
    //     const {
    //         name,
    //         description,
    //         price,
    //         productType
    //     } = req.body;
    //     const newProduct = new Product({
    //         name,
    //         description,
    //         price,
    //         productType
    //     });
    //     await newProduct.save();
    // } catch (error) {
    //     console.log(error);
    //     throw error;
    // }
    const newProduct = new Product({
        name: "Jeese Lingard",
        description: "Eiusmod irure tempor tempor cillum ad non esse amet cillum incididunt duis. Magna reprehenderit proident elit tempor anim non amet est laborum et culpa. Cillum do cillum do laborum ex nisi. Cupidatat consequat aute aliqua sint est.",
        price: 1111,
        productType: '608bde3f5c5c365388ed62e8'
    });
    await newProduct.save();
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