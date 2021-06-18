const express = require("express");
const router = express.Router();
const ProductType = require('../../model/productType');

router.get('/add', async (req, res) => {
    res.render("./admin/addProductType", {
        msg: req.query.msg || '',
    });
   
})

router.get('/index',async(req,res)=>{
    
    try{
        const types = await ProductType.find()
        
            res.render("./admin/indexProductType",{
                types: types,
                msg: req.query.msg || '',
                // errorMessage: err.message
                })
               
       
    }
    catch{
        res.redirect('/admin')
    }
   
})
router.post('/add', async (req, res) => {
    let msg = '';
    try {
        if (await ProductType.findOne({
                name: req.body.name.trim()
            }).exec())
            msg = "Tên loại sản phẩm đã tồn tại";
        else {
            const newProductType = new ProductType({
                name: req.body.name
            });
            await newProductType.save();
            // msg = "Thêm loại sản phẩm thành công";
            res.redirect('/admin/product/type/index')
        }
    } catch (error) {
        console.log(error);
        msg = "Thêm loại sản phẩm thất bại";
        res.redirect('/admin/product/type/add?msg=' + msg);
    }
  
})
// Update loại sản phẩm:
router.get('/edit/:id', async (req,res)=>{
    try{
        
        const type = await ProductType.findById(req.params.id)
        res.render('./admin/editProductType',{
            type:type,
            msg: req.query.msg || ''
        })
    }
    catch(err){
        console.log(err)
        res.redirect('/admin')
    }
   
})

router.put('/edit/:id', async (req,res)=>{
    let type 
    
    try{
         type = await ProductType.findById(req.params.id)
        // if(await ProductType.findOne({
        //     name: req.body.name.trim()
        // }).exec()){
        //     msg = "Tên loại sản phẩm đã tồn tại";
        //     res.redirect(`/admin/product/type/edit/${type.id}?msg=` + msg);
        // }else{  // nếu tên sp vẫn chưa tồn tại
            type.name = req.body.name
            await type.save()
            res.redirect('/admin/product/type/index')
        // }
       
    }
    catch(err){
        console.log(err)
        // ham xu ly khi  tim kiem loại sp bị lỗi khi tìm trong database:
        if( type == null){
            res.redirect('/admin/product/type/index')
        }else{ // nếu trong việc update bị lỗi, sẽ hiểu thị lại
            res.render('./admin/editProductType',{
                type:type,
                msg: "Lỗi update loại sản phẩm"            
            })
        }
       
    }     
})
//Xóa loại sản phẩm
router.delete('/:id', async (req,res)=>{
    let type
    try{
        type= await ProductType.findById(req.params.id)
        await type.remove()
        res.redirect('/admin/product/type/index')
    }
    catch(err){
        console.log(err)
        if(type ==null){
            res.redirect('/admin')
        }else{
          
             res.redirect('/admin/product/type/index?msg='+err)
           
               
        }
    }
})
module.exports = router