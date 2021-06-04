const express = require("express");
const router = express.Router();
const Product = require('../../model/product');
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

module.exports = router