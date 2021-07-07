const express = require("express");
const router = express.Router();
const Product = require('../../model/product');
const ProductType = require('../../model/productType');
const mongoose = require('mongoose');

const {
    auth
} = require('../../middleware/auth')
const {
    cartFillter
} = require("../../middleware/cart")


const extractNumberFromString = str => {
    return parseInt(str.replace(/[^0-9]/g, ''));
}

const render = async (req, res) => {
    let query = {}
    if (req.searchWord) {
        const searchWords = req.searchWord.split(" ").map(e => new RegExp(e, 'i'))
        query = searchWords.length > 0 ? {
            $or: [{
                name: {
                    "$all": searchWords
                }
            }, {
                description: {
                    "$all": searchWords
                }
            }]
        } : {};
    }
    const products = await Product.find(query).limit(7)
    res.render("./client/category", {
        products: products.length >= 7 ? products.slice(0, 6) : products,
        loadMore: products.length >= 7,
        productTypes: await ProductType.find(),
        isAdmin: req.userRole == "admin" ? "Admin" : "",
        isLogin: req.userName,
        cartQnt: req.cart.items.length,
        searchWord: req.searchWord
    });
}

router.get("/", auth, cartFillter, render);

router.post("/", auth, cartFillter, async (req, res) => {
    const conditions = JSON.parse(req.body["data"]);
    //req.session.searchWord = conditions["text-search"]
    const searchWords = req.session.searchWord ? req.session.searchWord.split(" ").map(e => new RegExp(e, 'i')) : []
    const queryName = searchWords.length > 0 ? {
        $or: [{
            name: {
                "$all": searchWords
            }
        }, {
            description: {
                "$all": searchWords
            }
        }]
    } : {};

    // fillter
    let products;
    if (!conditions["productType"].length)
        products = await Product.find({
            $and: [queryName, {
                "price": {
                    $gte: extractNumberFromString(conditions["minamount"])
                }
            }, {
                "price": {
                    $lte: extractNumberFromString(conditions["maxamount"])
                }
            }]
        }).skip(parseInt(conditions["offset"])).limit(7)
    else {
        products = await Product.find({
            $and: [queryName, {
                $and: [{
                    "price": {
                        $gte: extractNumberFromString(conditions["minamount"])
                    }
                }, {
                    "price": {
                        $lte: extractNumberFromString(conditions["maxamount"])
                    }
                }]
            }, {
                productType: {
                    $in: conditions["productType"].map(e => mongoose.mongo.ObjectId(e))
                }
            }]
        }).skip(parseInt(conditions["offset"])).limit(7)
    }
    if (products.length >= 7) {
        res.status(200).send({
            products: products.slice(0, 6),
            searchWord: req.body.search,
            more: true
        })
    } else {
        res.status(200).send({
            products: products,
            searchWord: req.body.search,
            more: false
        })
    }
})

router.post("/search", auth, cartFillter, (req, res, next) => {
    req.searchWord = req.body.search
    req.session.searchWord = req.body.search
    next()
}, render)
module.exports = router;