import express from 'express'
const router = express.Router();
import fs from 'fs';

import  auth  from '../middleware/auth.js'
import { getProduct,getcontact } from '../controllers/Product/Product.js';

router.get('/', auth ,getProduct );

router.get('/contact' , getcontact);




export default router;