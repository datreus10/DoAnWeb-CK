const express = require("express");
const router = express.Router();
const User = require('./../../model/user')
const Bill = require('./../../model/bill');



router.get('/',async (req,res)=>{
      bills = await Bill.find()
      users = await User.find()
      userhasBill = []
        for( const user of users){
            for( const bill of bills){
                if(user.id == bill.userId ){
                    userhasBill.push(user)
                    break
                }

            }
        }

     res.render('./admin/manageBill_index.ejs',{users: userhasBill})
})
router.get('/user/:id', async(req,res)=>{
    
    bills = await Bill.find({   
        userId:req.params.id
    })
    const user = await User.findById({_id:req.params.id})
    res.render('./admin/manageUserBill.ejs',{
        bills:bills,
        user:user,
        msg: req.query.msg || ''
    })

})
router.get('/user/editbill/:id',async (req,res)=>{
    
    const bill = await Bill.findById({_id:req.params.id})
    res.render('./admin/manageEditBill.ejs',{
        bill:bill,
        msg: req.query.msg || ''
    })
})
router.put('/user/editbill/:id',async (req,res)=>{
    const status = parseInt(req.body.status)
    var bill = await Bill.findById({_id:req.params.id})
    bill.isPaid = status
    try{
        await bill.save()
        res.redirect(`/admin/bill/user/editbill/${bill.id}?msg=`+"Cập nhật thành công")
    }
    catch(err){
        console.log(err)
        res.redirect(`/admin/bill/user/${bill.userId}?msg=`+"Không thể cập nhật trạng thái")
    }
})
module.exports= router