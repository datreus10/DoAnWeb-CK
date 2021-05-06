const express = require("express");
const router = express.Router();


router.get('/',async (req, res) => {
    res.render("./client/cart", {
        layout: './layout/clientLayout'
    });
})


module.exports = router