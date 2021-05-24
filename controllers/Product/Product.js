import express from 'express';
import mongoose from 'mongoose';
import Product from '../../models/Product.js';



const router = express.Router();


export const getProduct = async (req, res) => { 

    try {
        var data = await Product.find();
        const username= req.userName;
        res.status(200).render('index', {products: data, username: username} );
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getProductByID= async (req, res) => { 
    
    try {
        
        var id= req.params.id;
        var data = await Product.findById(id);
        res.status(200).render('product', {products: data} );
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const addProduct = async (req, res) => {
    var images = [];
    const files = req.files;
    for (let index = 0, len = files.length; index < len; ++index)
    {
        images[index] = req.files[index].filename;
    }
    
    const { name, description,details, price } = req.body;
    const newProduct = new Product({ name, description,details, price, images })
    try {
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const files = req.files;
    for (let index = 0, len = files.length; index < len; ++index)
    {
        images[index] = req.files[index].filename;
    }
    const { name, description,details, price } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { name, description,details, price, images, _id: id };

    await Product.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await Product.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}


export const getdelete =  async (req, res) => {
    

    try {
        var data = await Product.find();
        res.status(200).render('delete', {products: data} );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


export const getaddProduct = (req, res) => {
    

    try {
        res.status(201).render('addProduct');
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}
export const getUpdateProduct = (req, res) => {
    

    try {
        res.status(201).render('update');
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const getcontact = (req, res) => {
    try {
        res.status(201).render('contact');
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

