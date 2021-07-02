const express = require("express");
const router = express.Router();

const { getsignup, signin, signup, getsignin,getlogout} = require('../../controllers/auth/auth.js');
const {auth} = require ('../../middleware/auth')
const {
    cartFillter
} = require("../../middleware/cart")

router.get('/signin',auth ,cartFillter, getsignin) 
router.get('/signup',auth,cartFillter, getsignup)
router.post('/signin',auth, signin) 
router.post('/signup',auth, signup)
router.get('/logout',getlogout) 



module.exports = router;