const express = require("express");
const router = express.Router();
const Cart = require("../../model/cart");


router.get('/', async (req, res) => {
    if(req.session.user){
        res.render('./client/checkout', {
            isLogin: req.session.user.name,
            cart: await Cart.findOne({
                userId: req.session.user._id
            }).populate({
                path: 'items.itemId',
                select: '_id name img price'
            }),
        })
    }else{
        res.redirect("/")
    } 
    
})

module.exports = router;