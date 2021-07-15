const User = require('../../model/user.js')
const Bill = require('../../model/bill.js')
const Product = require('../../model/product.js')
const mongoose= require('mongoose');

const getdetailedBill = async (req, res) => {
    req.session.searchWord="";
    try {
        
        const id=req.userID;
        
        if(id){
            const Userid = await User.findById(id);
            const Username = Userid.name;
            DetailedBills= await Bill.find({$and: [{_id: req.params.id},{userId: id}]})
            if(!DetailedBills && DetailedBills=="")
            {
                res.redirect('/myaccount')
            }
            // var item=[]
            // DetailedBills[0].items.forEach(Finditem)
            // async function Finditem(Detaileditems){
            //     item.push(await Product.findById(Detaileditems.itemId))
            // }
            async function Finditem(items) {
                var item = [];
                for (const listitems of items) {
                    const Listitem = await Product.findById(listitems.itemId)
                    item.push(Listitem);
                }
                return item;
                
            }
            const item= await Finditem(DetailedBills[0].items)
            return res.status(201).render('./customer/detailedbill', 
            {
                Username: Username, 
                isAdmin: req.userRole=="admin"? "Admin": "",
                isLogin: req.userName,
                Bills: DetailedBills,
                Items: item,
                cartQnt : req.cart.items.length
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