import express from 'express'
const router = express.Router();

import { getsignup, signin, signup, getsignin, logout,getlogout} from '../../controllers/auth/auth.js';




router.get('/signin',getsignin) 
router.get('/signup', getsignup)
router.post('/signin',signin) 
router.post('/signup', signup)
router.get('/logout',getlogout) 



export default router;