const express = require("express");
const router = express.Router();
const Cart = require("../../model/cart");
const {auth} = require ('../../middleware/auth')

router.get('/', auth, async (req, res) => {
    if(req.user){
        res.render('./client/checkout', {
            isAdmin: req.userRole=="admin"? "Admin": "",
            isLogin: req.userName,
            cart: await Cart.findOne({
                userId: req.userID
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