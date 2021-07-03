const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');


const {
    sendmail
}
= require ("../../middleware/sendmail.js")
const {
    Cart,
    CartItem
} = require("../../model/cart");

const Product = require("../../model/product");

const Bill = require("../../model/bill");
const {
    auth
} = require('../../middleware/auth')
const User = require('../../model/user');


router.get('/', auth, async (req, res) => {
    if (req.user) {
        userId=req.userID
        const usercart = await Cart.findOne({userId: userId})
        const cart= await usercart.populate({
            path: 'items.itemId',
            select: '_id name img price'
        }).execPopulate()

        const user = await User.findById(req.userID)

        res.render('./client/checkout', {
            isAdmin: req.userRole == "admin" ? "Admin" : "",
            isLogin: req.userName,
            user: user,
            cart: cart,
            cartQnt : cart.items.length,
        })
    } else {
        res.redirect("/signin")
    }

});

router.post('/', auth, async (req, res) => {
    const listItem = JSON.parse(req.body["data"]).map(e => {
        return {
            itemId: e["product-checkbox"],
            quantity: e["quantity"],
            size: e["size"]
        }
    });
    req.session.urlcheckout="checkout";
    res.status(200).send({
        result: 'redirect',
        url: '/checkout'
    })
    
});

router.post('/thanh_toan', auth, async (req, res) => {
    if (req.user) {
        console.log("Hello");
        const cart = await Cart.findOne({
            userId: req.userID
        }).populate({
            path: 'items.itemId',
            select: '_id name price'
        });

        // tao bill
        const bill = new Bill({
            userId: cart.userId,
            items: cart.items,
            total: cart.total,
            address: req.body.address,
            phone: req.body.phone
        });
        await bill.save();
        // giam so luong san pham theo size
        for (let item of cart.items) {
            // const y  = await Product.findOne({_id: item.itemId.id,'sizes.name':item.size});
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
            _id: cart._id
        }, {
            $set: {
                "items": []
            }
        });
        const userinfo = await User.findById(bill.userId)
        console.log(userinfo);
        content="<h1 align='center'> Thông tin đơn hàng </h1>"
        content=content+"<p> Họ Tên: " + userinfo.name + "</p>";
        content=content+ "<p> Địa chỉ giao hàng: "+bill.address+"</p>";
        content=content+ "<p> Điện thoại: "+bill.phone+"</p>";
        content=content+ "<p> Email: "+userinfo.email+"</p>";
        content=content+ "<table width='80%' cellspacing='0' cellpadding='2' border='1' align='center'>";
        content=content+ "<tr><td width = '10%' >STT</td><td width='10%'> Tên sản phẩm </td><td width='30%> Tên Hoa </td> <td width='10%'> Số Lượng </td><td width = '15%'> Đơn giá </td><td> Thành tiền </td></tr>";
        var stt=1;
        cart.items.forEach(item => {
            content=content+"<tr><td>"+stt+"</td><td>"+ item.itemId.name+"</td><td>"+item.quantity+"</td><td>"+item.itemId.price+"</td><td>"+item.quantity*item.itemId.price+"</td></tr>";
            stt++;
        });
        content=content+ "<tr><td colspan='7' align='right'> Tổng tiền:" + bill.total + "</td></tr></table>";
        content=content+ "<p>Trong cuộc sống có muôn ngàn lựa chọn, cảm ơn bạn đã chọn Shop nam. </p>";
        content=content+ "<p> Đơn hàng sẽ giao đến bạn trong vòng 7 ngày! </p>";
        sendmail(userinfo.email,"Shop nam",content)
        setTimeout(function() {
            res.redirect("/");
          }, 3000)
        
    } else {
        res.redirect("/");
    }

})

module.exports = router;