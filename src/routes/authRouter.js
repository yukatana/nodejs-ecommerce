const { Router } = require('express')
const authRouter = Router()
const authMiddleware = require('../utils/authMiddleware')
const {
    serveLogin,
    tryLogin,
    serveSignup,
    trySignup
} = require('../controllers/authController')

// GET login form
authRouter.get('/login', serveLogin)
// POST a login attempt
authRouter.post('/login', tryLogin)
// GET signup form
authRouter.get('/signup', serveSignup)
// POST a signup attempt
authRouter.post('/signup', trySignup)

module.exports = authRouter