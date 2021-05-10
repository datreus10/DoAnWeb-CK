const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('./client/checkout', {
        isLogin: req.session.user ? req.session.user.name : false,
        layout: './layout/clientLayout'
    })
})

module.exports = router;