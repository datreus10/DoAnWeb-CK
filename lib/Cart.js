const CartSchema = require('../model/cart');
const ProductSchema = require('../model/product');

class Cart {
    static getCartFromDb = async (userId) => {
        if (userId) {
            return await CartSchema.findOne({
                userId: userId
            }).populate({
                path: 'items.itemId',
                select: '_id name img price'
            });
        }
        return undefined;
    }
    static createCartDB = async (userId) => {
        await CartSchema.create({
            userId: userId,
            items: []
        })
    }

    static inCart = (itemId, size, cart) => {
        for (let i = 0; i < cart.items.length; i++)
            if (cart.items[i].itemId._id === itemId && cart.items[i].size === size)
                return i;
        return -1;
    }

    static addToCart = async (userId, itemId, quantity, size, cart) => {
        let index = this.inCart(itemId, size, cart);
        if (index === -1) {
            const result = {
                itemId: await ProductSchema.findById(itemId).select('_id name img price'),
                quantity: quantity,
                size: size
            }
            result.total = result.itemId.price * quantity;
            cart.items.push(result);
        } else {
            cart.items[index].total = cart.items[index].itemId.price * quantity;
            cart.items[index].quantity = quantity;
        }

        cart.total = cart.items.reduce((total, item) => total + item.quantity * item.itemId.price, 0);
        await this.saveCartToDB(userId, cart);
    }

    static saveCartToDB = async (userId, cart) => {
        await CartSchema.updateOne({
            userId: userId
        }, {
            items: cart.items,
            total: cart.total
        });
    }


}
module.exports = Cart;