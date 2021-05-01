const ProductType = require('../model/productType');

exports.addProductType = async (req, res, next) => {
    try {
        const newProductType = new ProductType({
            name: 'Kaki'
        });
        await newProductType.save();
    } catch (error) {
        console.log(error);
        throw error;
    }

}