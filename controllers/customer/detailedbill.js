const User = require('../../model/user.js')
const Bill = require('../../model/bill.js')
const mongoose= require('mongoose');

const getdetailedBill = async (req, res) => {
    try {
        
        const id=req.userID;

        if(id){
            const Userid = await User.findById(id);
            const Username = Userid.name;
            const email = Userid.email;
            DetailedBill= await Bill.find({$and: [{_id: req.params.id},{userId: id}]})
            if(!DetailedBill && DetailedBill=="")
            {
                res.redirect('/myaccount')
            }

            return res.status(201).render('./customer/detailedbill', 
            {
                Username: Username, 
                email: email,
                isAdmin: req.userRole=="admin"? "Admin": "",
                isLogin: req.userName,
                Bills: DetailedBill
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
module.exports = {getdetailedBill}