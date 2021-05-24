import express from 'express'
const router = express.Router();
import fs from 'fs';

import  auth  from '../../middleware/auth.js'
import { getCustomer } from '../../controllers/customer/customer.js';

router.get('/myaccount', auth ,getCustomer );


export default router;