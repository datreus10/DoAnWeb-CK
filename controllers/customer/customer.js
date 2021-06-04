const User = require('../../model/user.js')
const mongoose= require('mongoose');

const getCustomer = async (req, res) => {
    try {
        
        const id=req.userID;
        if(id){
            const UserID = await User.findById(id);
            const Username = UserID.name;
            const email = UserID.email;
            if(UserID) 
                return res.status(201).render('./customer', {Username: Username, email: email});
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