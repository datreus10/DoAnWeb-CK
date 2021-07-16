const Product = require("../model/product");
const {
    Cart,
    CartItem
} = require("../model/cart");
const mongoose = require("mongoose");

const cartFillter = async (req, res, next) => {
    if (req.userID) {


        req.cart = await Cart.findOne({
            userId: req.userID
        })

        // code sync add item
        if (req.session.cart) {
            const listItem = []
            if(req.session.cart.items)
            {
                for (let item of req.session.cart.items) {
                listItem.push(new CartItem({
                    itemId: mongoose.mongo.ObjectId(item.itemId),
                    size: item.size,
                    quantity: item.quantity
                }))
            }
        }
            // update neu trung
            req.cart.items = req.cart.items.concat(listItem);
            req.cart.items = removeDuplicates(req.cart.items);


            // save cart lai
            await req.cart.save();
            req.session.cart = null;
            //
        }
    } else {
        if (req.session.cart) {
            const listItem = []  
            for (let item of req.session.cart.items) {
                listItem.push(new CartItem({
                    _id: mongoose.mongo.ObjectId(item._id),
                    itemId: mongoose.mongo.ObjectId(item.itemId),
                    size: item.size,
                    quantity: item.quantity
                }))
            }

            req.cart = new Cart({
                
                items: listItem
            })
        } else
            req.cart = new Cart();
    }
    next();
}

function removeDuplicates(inArray) {
    var arr = inArray.concat() // create a clone from inArray so not to change input array
    //create the first cycle of the loop starting from element 0 or n
    for (var i = 0; i < arr.length; ++i) {
        //create the second cycle of the loop from element n+1
        for (var j = i + 1; j < arr.length; ++j) {
            //if the two elements are equal , then they are duplicate
            if (arr[i].itemId.toString() === arr[j].itemId.toString() && arr[i].size.toString() === arr[j].size.toString()) {
                arr.splice(j, 1); //remove the duplicated element 
            }
        }
    }
    return arr;
}

const addItemToCart = async (req, res, next) => {
    const p = await Product.findById(req.params.id);
    const pSizeIndex = p.sizes.findIndex(element => element.name == req.body.size && element.quantity > 0)

    if (pSizeIndex > -1) {
        const cart = req.cart
        console.log(cart)
        let index = -1;

        cart.items.forEach((element,a) => {
            if(element.itemId.toString()==p._id){
                index=a;
            }
        });

        if (index > -1 && cart.items[index].size == req.body.size) {
            let newQuantity = parseInt(req.body.quantity) + cart.items[index].quantity;
            if (newQuantity > p.sizes[pSizeIndex].quantity)
                cart.items[index].quantity = p.sizes[pSizeIndex].quantity;
            else
                cart.items[index].quantity = newQuantity;
        } else {
            cart.items.push(new CartItem({
                itemId: p._id,
                quantity: req.body.quantity > p.sizes[pSizeIndex].quantity ? p.sizes[pSizeIndex].quantity : req.body.quantity,
                size: req.body.size
            }));
        }
        if (req.userID) {
            await cart.save();
        } else {
            req.session.cart = cart;
        }
    }
    next();
}

const removeItemFromCart = async function (req, res, next) {
    const cart = req.cart;


    for (let i = 0; i < cart.items.length; i++) {
        for (let j = 0; j < req.body.data.length; j++) {
            if (cart.items[i]._id.toString() == req.body.data[j].product) {
                
                cart.items.splice(i, 1);
            }
        }
    }
   
    
    if (req.userID) {
        await cart.save();
    } else {
        req.session.cart = cart;
    }
    next();
}

module.exports = {
    cartFillter,
    addItemToCart,
    removeItemFromCart
}