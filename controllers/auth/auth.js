const bcrypt = require('bcrypt');
const {
    compareSync
} = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../model/user.js');
const {Cart} = require('../../model/cart.js')
const express = require('express');
const bodyParser = require('body-parser');
const signin = async (req, res) => {
    const {
        email,
        password
    } = req.body;
    try {
        const existingUser = await User.findOne({
            email
        });
        if (!existingUser) return res.status(404).render('./auth/signin', {
            success: '',
            message: 'Tài khoản không tồn tại',
            isAdmin: req.userRole=="admin"? "Admin": "",
            isLogin: req.userName
        });
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).render('./auth/signin', {
            success: '',
            message: 'Sai mật khẩu',
            isAdmin: req.userRole=="admin"? "Admin": "",
            isLogin: req.userName
        });
        const token = jwt.sign({
            name: existingUser.name,
            id: existingUser._id,
            role: existingUser.role
        }, 'test', {
            expiresIn: "1h"
        });
        res.cookie("token", token);
        res.redirect('/');
    } catch (error) {
        res.status(500).send(error);
    }
}



const signup = async (req, res) => {
    const {
        name,
        email,
        password,
        Confirmpassword,
        address,
        phone_number,
        ls_province,
        ls_district,
        ls_ward,

    } = req.body;
    try {
        const existingUser = await User.findOne({
            email
        });
        if (existingUser) return res.status(400).render('./auth/signup', {
            message: "Tài khoản đã tồn tại",
            isAdmin: req.userRole=="admin"? "Admin": "",
            isLogin: req.userName
        });
        if (password !== Confirmpassword) return res.status(400).render('./auth/signup', {
            message: "Nhập lại mật khẩu không đúng",
            isAdmin: req.userRole=="admin"? "Admin": "",
            isLogin: req.userName
        });
        const fulladdress=address+", "+ls_ward+", "+ls_district+", "+ls_province;
        const hashedPassword = await bcrypt.hash(password, 12);
        const result = new User({
            name,
            email,
            password: hashedPassword,
            address: fulladdress,
            phone_number,
            role: 'member',
        })
        console.log(result)
        const token = jwt.sign({
            email: result.email,
            id: result._id,
            role: result.role
        }, 'test', {
            expiresIn: "1h"
        });
        await Cart.create({
            userId: result._id,
            items: []
        })

        await result.save();
        res.status(200).render('./auth/signin', {
            success: result.name,
            message: '',
            isAdmin: req.userRole=="admin"? "Admin": "",
            isLogin: req.userName
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
}


const getsignup = (req, res) => {

    try {
        res.status(201).render('./auth/signup', {
            message: '',
            isAdmin: req.userRole=="admin"? "Admin": "",
            isLogin: req.userName
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
}

const getsignin = (req, res) => {
    try {
        if (!req.cookies.token) {
            res.status(201).render('./auth/signin', {
                success: '',
                message: '',
                isAdmin: req.userRole=="admin"? "Admin": "",
                isLogin: req.userName
            });
        } else {
            res.redirect('/');
        }
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
}


const getlogout = (req, res) => {
    try {
        res.clearCookie("token");
        res.clearCookie("userName");
        res.redirect('/');
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
}
module.exports = {
    signin,
    getlogout,
    getsignin,
    getsignup,
    signup
}