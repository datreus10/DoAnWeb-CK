const express = require("express");
const router = express.Router();
const  {auth}  =require('../../middleware/auth.js');
const { getdetailedBill } =require('../../controllers/customer/detailedbill.js') ;
const jwt = require('jsonwebtoken');
const {
    cartFillter,
} = require("../../middleware/cart")

router.get('/myaccount/:id',auth,cartFillter, getdetailedBill) ;


module.exports = router