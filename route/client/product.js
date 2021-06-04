const express = require("express");
const router = express.Router();
const Product = require('../../model/product');
const jwt = require('jsonwebtoken');
const {auth} = require ('../../middleware/auth')
router.get('/:id',auth,async (req, res) => {
   
            res.render("./client/product", {
                product : await Product.findById(req.params.id),
                products : await Product.find().limit(8),
                isLogin : req.userName
            });
  
})



module.exports = router