const express = require("express");
const router = express.Router();
const  {auth}  =require('../../middleware/auth.js');
const { getdetailedBill } =require('../../controllers/customer/detailedbill.js') ;
const jwt = require('jsonwebtoken');
router.get('/myaccount/:id',auth,getdetailedBill) ;


module.exports = router