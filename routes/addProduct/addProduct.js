import express from 'express'
const router = express.Router();

import { upload } from '../../middleware/uploadimg.js'
import  auth  from '../../middleware/auth.js'
import { addProduct, getaddProduct} from '../../controllers/Product/Product.js';




router.post('/addProduct', upload.array('images',10), addProduct) 
router.get('/addProduct',auth, getaddProduct)


export default router;