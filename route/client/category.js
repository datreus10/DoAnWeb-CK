const express = require("express");
const router = express.Router();
const Product = require('../../model/product');
const ProductType = require('../../model/productType');

const {
    auth
} = require('../../middleware/auth')
const {
    cartFillter
} = require("../../middleware/cart")

router.get("/", auth,cartFillter, async (req, res) => {
    res.render("./client/category", {
        lastedProducts: await Product.find().sort({
            createAt: -1
        }).limit(10),
        products: await Product.find().limit(8),
        productTypes: await ProductType.find(),
        // isLogin: req.session.user ? req.session.user.name : false
        isAdmin: req.userRole=="admin"? "Admin": "",
        isLogin: req.userName,
        cartQnt : req.cart.items.length
    });
});
router.get("/:id", auth,cartFillter, async (req, res) => {
    const id_productType = req.params.id
    res.render("./client/category", {
        lastedProducts: await Product.find().sort({
            createAt: -1
        }).limit(10),
        products: await Product.find({productType:id_productType}).limit(8),
        productTypes: await ProductType.find(),
        // isLogin: req.session.user ? req.session.user.name : false
        isAdmin: req.userRole=="admin"? "Admin": "",
        isLogin: req.userName,
        cartQnt : req.cart.items.length
    });
})
router.post("/",auth,async (req,res) =>{
    let query={};
    if(!req.body.search)
    {
        const min=parseInt(req.body.minamount)
        const max=parseInt(req.body.maxamount)
        if(req.body.productType){
            query={$and: [
                { $and: [ { price: { $lt : max} }, { price : { $gt:  min} } ] },
                {productType: {"$in" : req.body.productType}}
            ]
            } ;
        }
        else
        {
            query={ $and: [ { price: { $lt : max} }, { price : { $gt:  min} } ] } ;
        }

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