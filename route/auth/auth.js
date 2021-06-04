const express = require("express");
const router = express.Router();

const { getsignup, signin, signup, getsignin,getlogout} = require('../../controllers/auth/auth.js');




router.get('/signin',getsignin) 
router.get('/signup', getsignup)
router.post('/signin',signin) 
router.post('/signup', signup)
router.get('/logout',getlogout) 



module.exports = router;