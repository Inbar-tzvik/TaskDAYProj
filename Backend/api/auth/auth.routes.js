const express = require('express')
const { login, signup, logout, getLoggedInUser } = require('./auth.controller')

const router = express.Router()

router.post('/login', login)
router.post('/loggedin', getLoggedInUser)
router.post('/signup', signup)
router.post('/logout', logout)

module.exports = router