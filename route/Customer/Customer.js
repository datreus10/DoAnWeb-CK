const express = require("express");
const router = express.Router();
const  {auth}  =require('../../middleware/auth.js');
const { getCustomer, changepassword } =require('../../controllers/customer/customer.js') ;
const jwt = require('jsonwebtoken');
const {
    cartFillter
} = require("../../middleware/cart")

router.get('/myaccount',auth,cartFillter, getCustomer) ;
router.post('/myaccount',auth,changepassword) ;

module.exports = router