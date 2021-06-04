const express = require("express");
const router = express.Router();
const  {auth}  =require('../../middleware/auth.js');
const { getCustomer } =require('../../controllers/customer/customer.js') ;
const jwt = require('jsonwebtoken');
router.get('/myaccount',auth,getCustomer) ;


module.exports = router