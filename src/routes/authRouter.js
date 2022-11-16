const { Router } = require('express')
const authRouter = Router()
const { passportSignup, passportLogin } = require('../middlewares/auth/passport')
const authController = require('../controllers/authController')

// GET login form
authRouter.get('/login', authController.serveLogin)
// POST a login attempt
authRouter.post('/login', passportLogin, authController.tryLogin)
// GET login error page
authRouter.get('/login', authController.serveLoginError)
// GET signup form
authRouter.get('/signup', authController.serveSignup)
// POST a signup attempt
authRouter.post('/signup', passportSignup, authController.trySignup)
// GET signup error page
authRouter.get('/login', authController.serveSignupError)
//GET logout page
authRouter.get('/logout', authController.serveLogout)
// POST a logout attempt
authRouter.post('/logout', authController.logout)

module.exports = authRouter