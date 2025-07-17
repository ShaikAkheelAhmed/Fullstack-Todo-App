const userCtrl = require('../controllers/userCtrl')
const express = require('express')
const router = express.Router()


router.post('/Signup', userCtrl.signUp)

router.post('/Signin', userCtrl.signIn)

module.exports = router