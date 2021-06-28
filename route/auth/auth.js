const express = require("express");
const router = express.Router();

const { getsignup, signin, signup, getsignin,getlogout} = require('../../controllers/auth/auth.js');
const {auth} = require ('../../middleware/auth')
const {
    cartFillter,addItemToCart,removeItemFromCart
} = require("../../middleware/cart")


router.get('/signin',auth,cartFillter ,getsignin) 
router.get('/signup',auth, getsignup)
router.post('/signin',auth, signin,cartFillter) 
router.post('/signup',auth, signup)
router.get('/logout',getlogout) 



module.exports = router;