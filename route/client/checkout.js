const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');


const {
    sendmail
} = require("../../middleware/sendmail.js")
const {
    Cart
} = require("../../model/cart");

const Product = require("../../model/product");

const Bill = require("../../model/bill");
const {
    auth
} = require('../../middleware/auth')
const User = require('../../model/user');
const {
    cartFillter
} = require("../../middleware/cart")
const ejs = require('ejs')


router.get('/', auth, cartFillter, async (req, res) => {
    req.session.searchWord="";
    if (req.user && req.session.checkoutItem.length) {
        const usercart = new Cart({
            userId: req.userID,
            items: req.session.checkoutItem
        })
        const cart = await usercart.populate({
            path: 'items.itemId',
            select: '_id name img price'
        }).execPopulate()

        const user = await User.findById(req.userID)

        res.render('./client/checkout', {
            isAdmin: req.userRole == "admin" ? "Admin" : "",
            isLogin: req.userName,
            user: user,
            cart: cart,
            cartQnt: req.cart.items.length,
        })
    } else {
        res.redirect("/signin")
    }

});

router.post('/', auth, async (req, res) => {
    const listItem = JSON.parse(req.body["data"]).map(e => {

        return {
            _id: e["_id"],
            itemId: e["product-checkbox"],
            quantity: e["quantity"],
            size: e["size"]
        }


    });
    req.session.checkoutItem = listItem;
    req.session.urlcheckout = "checkout";
    res.status(200).send({
        result: 'redirect',
        url: '/checkout'
    })

});

router.post('/thanh_toan', auth, async (req, res) => {
    if (req.user) {
        req.session.checkoutUserInfo = {
            address: req.body.address,
            phone: req.body.phone,
            userId: req.userID
        }
        if (req.body.payment == 'card') {
            let cart = new Cart({
                userId: req.userID,
                items: req.session.checkoutItem
            })
            cart = await cart.populate({
                path: 'items.itemId',
                select: '_id name img price'
            }).execPopulate()
            vnpay(req, res, cart)
        } else {
            createBill(req, res)
            setTimeout(function () {
                res.status(302).send('/')
            }, 3000)
        }
    } else {
        res.status(302).send('/')
    }

})



async function createBill(req, res) {
    let cart = new Cart({
        userId: req.session.checkoutUserInfo.userId,
        items: req.session.checkoutItem
    })

    const usercart = await Cart.findOne({
        userId: req.session.checkoutUserInfo.userId
    });
    const listId = req.session.checkoutItem.map(e => e._id)
    const remainItem = usercart.items.filter(e => listId.indexOf(e._id.toString()) < 0)

    cart = await cart.populate({
        path: 'items.itemId',
        select: '_id name img price'
    }).execPopulate()

    // tao bill
    const bill = new Bill({
        userId: cart.userId,
        items: cart.items,
        total: cart.total,
        address: req.session.checkoutUserInfo.address,
        phone: req.session.checkoutUserInfo.phone,
        isPaid: req.isPaid || 0
    });
    await bill.save();
    // giam so luong san pham theo size
    for (let item of cart.items) {
        await Product.updateOne({
            _id: item.itemId.id,
            'sizes.name': item.size
        }, {
            $inc: {
                'sizes.$.quantity': -item.quantity
            }
        })
    }
    await Cart.updateOne({
        _id: usercart._id
    }, {
        $set: {
            "items": remainItem
        }
    });

    const userinfo = await User.findById(bill.userId)
    const htmlEmail = await ejs.renderFile("./views/client/templateMail.ejs", {
        userinfo: userinfo,
        bill: bill,
        items: cart.items
    });
    sendmail(userinfo.email, "Shop nam", htmlEmail)
}

function sortObject(o) {
    var sorted = {},
        key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}

function vnpay(req, res, cart) {
    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    require('dotenv').config()
    var dateFormat = require('dateformat');


    var tmnCode = process.env.vnp_TmnCode;
    var secretKey = process.env.vnp_HashSecret;
    var vnpUrl = process.env.vnp_Url;
    var returnUrl = process.env.vnp_ReturnUrl;

    var date = new Date();

    var createDate = dateFormat(date, 'yyyymmddHHmmss');
    var orderId = dateFormat(date, 'HHmmss');
    var amount = cart.total;
    var bankCode = req.body.bankCode;

    var orderInfo = "Thanh toan don hang thoi gian: " + dateFormat(date, 'HH:mm:ss dd-mm-yyyy');
    var orderType = "fashion";
    var locale = req.body.language || 'vn';


    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var querystring = require('qs');
    var signData = secretKey + querystring.stringify(vnp_Params, {
        encode: false
    });

    var sha256 = require('sha256');

    var secureHash = sha256(signData);

    vnp_Params['vnp_SecureHashType'] = 'SHA256';
    vnp_Params['vnp_SecureHash'] = secureHash;
    vnpUrl += '?' + querystring.stringify(vnp_Params, {
        encode: true
    });


    res.status(200).json({
        code: '00',
        data: vnpUrl
    })
    //res.redirect(vnpUrl)
}


router.get('/vnpay_return', function (req, res, next) {
    var vnp_Params = req.query;

    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    require('dotenv').config()
    var tmnCode = process.env.vnp_TmnCode;
    var secretKey = process.env.vnp_HashSecret;

    var querystring = require('qs');
    var signData = secretKey + querystring.stringify(vnp_Params, {
        encode: false
    });

    var sha256 = require('sha256');

    var checkSum = sha256(signData);

    if (secureHash === checkSum) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        req.isPaid = 1
        createBill(req, res)
        res.render('./client/payment', {
            msg: "GD thành công"
        })
    } else {
        res.render('./client/payment', {
            msg: "GD thất bại"
        })
    }
});

module.exports = router;