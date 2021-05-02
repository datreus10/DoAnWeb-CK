const ProductType = require('../model/productType');

exports.addProductType = async (req, res, next) => {
    try {
        if (req.body.name) {
            const newProductType = new ProductType({
                name: req.body.name
            });
            await newProductType.save();
            return "Success";
        }
    } catch (error) {
        console.log(error);
        return "Fail";
    }
}

exports.getAllProductTypes = async (req, res, next) => {
    try {
        return await ProductType.find();
    } catch (error) {
        console.log(error);
        throw error;
    }
}