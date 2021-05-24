import bcrypt, { compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js'
import express from 'express';
import Product from '../../models/Product.js';
import bodyParser from 'body-parser';

export const signin = async (req,res) => {
    const { email, password} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if(!existingUser) return res.status(404).render('signin', {success: '' ,message: 'Account not exist'});
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect) return res.status(400).render('signin', {success: '' ,message: 'Password is invalid'});
        const token = jwt.sign({ name: existingUser.name, id: existingUser._id}, 'test' , {expiresIn: "10s"});
        res.cookie("token", token);
        res.redirect('/');
    } catch (error) {
        res.status(500).send(error);
    }
}



export const signup = async (req,res) => {
    const { name,email, password, Confirmpassword} = req.body;
    try { 
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).render('signup', {message: "Account exist"});
        if(password!==Confirmpassword) return res.status(400).render('signup', {message: "Password don't match"});
        const hashedPassword = await bcrypt.hash(password,12 ); 
        const result = new User({ name, email, password: hashedPassword })
        const token = jwt.sign({ email: result.email, id: result._id}, 'test' , {expiresIn: "1h"});
        await result.save();
        res.status(200).render('signin', {success: result.name, message: ''});
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const logout = async (req,res) => {
    try {
        res.clearCookie("token");
        res.clearCookie("userName");
        res.redirect('/');
    } catch (error) {
        res.status(500).send(error);
    }
}


export const getsignup = (req, res) => {
    
    try {
        res.status(201).render('signup', {message: ''});
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const getsignin = (req, res) => {
    try {
        if(!req.cookies.token)
        {
            res.status(201).render('signin', {success: '',message: ''});
        }
        else 
        {
            res.redirect('/');
        }
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


export const getlogout = (req, res) => {
    try {
        res.clearCookie("token");
        res.clearCookie("userName");
        res.redirect('/');
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}
