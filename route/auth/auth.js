const express = require("express");
const router = express.Router();

const { getsignup, signin, signup, getsignin,getlogout} = require('../../controllers/auth/auth.js');
const {auth} = require ('../../middleware/auth')



router.get('/signin',auth,getsignin) 
router.get('/signup',auth, getsignup)
router.post('/signin',auth,signin) 
router.post('/signup',auth, signup)
router.get('/logout',getlogout) 



module.exports = router;