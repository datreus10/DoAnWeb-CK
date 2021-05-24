import express from 'express'
const router = express.Router();

import { deletePost, getdelete} from '../../controllers/Product/Product.js';




router.delete('/:id',deletePost) 
router.get('/:id', getdelete)


export default router;