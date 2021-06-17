const express = require("express");
const router = express.Router();
const Product = require('../../model/product');
const Cart = require('../../model/cart')
const Bill = require('../../model/bill')
const jwt = require('jsonwebtoken');
const {auth_admin} = require ('../../middleware/auth_admin')
router.get('/', auth_admin,async (req, res) => {
                    res.render("./admin/index", {
                        products: await Product.find().sort({
                            createAt: -1
                        }).limit(10),
                    })
                }
)
router.get('/test',async (req,res)=>{
   
    data = await Cart.find({
        'items.itemId':'60b9ff89b5f3622a04a3420f'
    }).populate({
        path: 'items.itemId',
      
    })
  
    res.send({
        data
    })
})
module.exports = router