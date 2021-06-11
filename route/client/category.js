const express = require("express");
const router = express.Router();
const Product = require('../../model/product');
const ProductType = require('../../model/productType');
const User = require('../../model/user');
const Cart = require('../../model/cart');
const {
    auth
} = require('../../middleware/auth')




router.get("/", auth, async (req, res) => {
    res.render("./client/category", {
        lastedProducts: await Product.find().sort({
            createAt: -1
        }).limit(10),
        products: await Product.find().limit(8),
        productTypes: await ProductType.find(),
        // isLogin: req.session.user ? req.session.user.name : false
        isAdmin: req.userRole=="admin"? "Admin": "",
        isLogin: req.userName
    });
});
router.post("/",auth,async (req,res) =>{
    let query={};
    if(!req.body.search)
    {
        query={productType: {"$in" : req.body.productType}};
    res.render("./client/category", {
        lastedProducts: await Product.find(query).sort({
            createAt: -1
        }).limit(10),
        products: await Product.find(query).limit(8),
        productTypes: await ProductType.find(),
        isAdmin: req.userRole=="admin"? "Admin": "",
        // isLogin: req.session.user ? req.session.user.name : false
        isLogin: req.userName
    });}
    else
    {
        query= {$or:[{name: new RegExp(req.body.search,'i')},{description: new RegExp(req.body.search,'i')}]};
    res.render("./client/category", {
        lastedProducts: await Product.find(query).sort({
            createAt: -1
        }).limit(10),
        products: await Product.find(query).limit(8),
        productTypes: await ProductType.find(),
        // isLogin: req.session.user ? req.session.user.name : false
        isAdmin: req.userRole=="admin"? "Admin": "",
        isLogin: req.userName
    });}
})
module.exports = router;