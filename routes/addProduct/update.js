import express from 'express'
const router = express.Router();

import { upload } from '../../middleware/uploadimg.js'
import { updatePost, getUpdateProduct} from '../../controllers/Product/Product.js';




router.post('/updatePost', upload.array('images',10), updatePost) 
router.get('/updatePost', getUpdateProduct)


export default router;