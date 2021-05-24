import express from 'express'
const router = express.Router();

import { getProductByID } from '../../controllers/Product/Product.js';

router.get('/:id', getProductByID);


export default router;