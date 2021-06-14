const User = require('../../model/user.js')
const Bill = require('../../model/cart.js')
const mongoose= require('mongoose');

const getCustomer = async (req, res) => {
    try {
        
        const id=req.userID;
        query={userId: id};
        const ListBill= await Bill.find(query)
        if(id){
            const Userid = await User.findById(id);
            const Username = Userid.name;
            const email = Userid.email;
            return res.status(201).render('./customer/customer', 
            {
                Username: Username, 
                email: email,
                isAdmin: req.userRole=="admin"? "Admin": "",
                isLogin: req.userName,
                Bill: ListBill[0]._id
            });
        }
        else
        {
            return res.status(401).redirect('/');
        }

    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}
module.exports = {getCustomer}