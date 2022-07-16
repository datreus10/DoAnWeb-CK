const User = require('../../model/user.js')
const Bill = require('../../model/bill.js')
const mongoose= require('mongoose');
const bcrypt = require('bcrypt');

const getCustomer = async (req, res) => {
    req.session.searchWord="";
    try {
        const id=req.userID;
        if(!id)
        {
            res.redirect('/signin');
        }
        else{
        query={userId: id};
        const ListBill= await Bill.find(query)
        if(id){
            const Userid = await User.findById(id);
            const Username = Userid.name;
            const email = Userid.email;
            const address = Userid.address;
            const phone_number=Userid.phone_number;
            return res.status(201).render('./customer/customer', 
            {
                Username: Username, 
                email: email,
                address: address,
                phone_number: phone_number,
                message: '',
                message_success: '',
                isAdmin: req.userRole=="admin"? "Admin": "",
                isLogin: req.userName,
                Bills: ListBill,
                cartQnt : req.cart.items.length
            });
        }
        else
        {
            return res.status(401).redirect('/');
        }            
    }
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}
const changepassword = async (req, res) => {
    try {
        const {
            oldpassword,
            password,
            Confirmpassword
        } = req.body;
        const user = await User.findById(req.userID)
        query={userId: req.userID};
        const ListBill= await Bill.find(query)
        const Username = user.name;
        const email = user.email;
        const address =user.address;
        const phone_number=user.phone_number;
        const isPasswordCorrect = await bcrypt.compare(oldpassword, user.password);
        if (!isPasswordCorrect) return res.status(400).render('./customer/customer', {
            message: 'Sai mật khẩu',
            message_success: '',
            isAdmin: req.userRole=="admin"? "Admin": "",
            isLogin: req.userName,
            Username: Username, 
            email: email,
            address: address,
            phone_number: phone_number,
            Bills: ListBill,
            cartQnt : req.cart.items.length
        });
        if (password !== Confirmpassword) return res.status(400).render('./customer/customer', {
            message: 'Nhập lại mật khẩu không đúng',
            message_success: '',
            isAdmin: req.userRole=="admin"? "Admin": "",
            isLogin: req.userName,
            Username: Username, 
            phone_number: phone_number,
            address: address,
            email: email,
            Bills: ListBill,
            cartQnt : req.cart.items.length
        });
        const hashedPassword = await bcrypt.hash(password, 12);
        user.password=hashedPassword;
        await user.save();
        console.log(user)
        res.status(200).render('./customer/customer', {
            message: '',
            message_success: 'Đổi mật khẩu thành công',
            isAdmin: req.userRole=="admin"? "Admin": "",
            isLogin: req.userName,
            Username: Username, 
            phone_number: phone_number,
            address: address,
            email: email,
            Bills: ListBill,
            cartQnt : req.cart.items.length
        });
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {getCustomer, changepassword}