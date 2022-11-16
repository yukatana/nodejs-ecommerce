const { Router } = require('express')
const authRouter = Router()
const {
    serveLogin,
    tryLogin,
    serveSignup,
    trySignup,
    logout
} = require('../controllers/authController')

const {
    passportSignup,
    passportLogin
} = require('../middlewares/auth/passport')

// GET login form
authRouter.get('/login', serveLogin)
// POST a login attempt
authRouter.post('/login', passportLogin, tryLogin)
// GET signup form
authRouter.get('/signup', serveSignup)
// POST a signup attempt
authRouter.post('/signup', passportSignup, trySignup)
// POST a logout attempt
authRouter.post('/logout', logout)

module.exports = authRouter