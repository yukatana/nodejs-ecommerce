const { Router } = require('express')
const authRouter = Router()
const { passportSignup, passportLogin } = require('../middlewares/auth/passport')
const authController = require('../controllers/authController')
const { sendRegisteredUserEmail } = require('../services/twilio')

// GET login form
authRouter.get('/login', authController.serveLogin)
// POST a login attempt
authRouter.post('/login', passportLogin, authController.saveSession)
// GET login error page
authRouter.get('/loginError', authController.serveLoginError)
// GET signup form
authRouter.get('/signup', authController.serveSignup)
// POST a signup attempt
authRouter.post('/signup', passportSignup, sendRegisteredUserEmail, authController.saveSession)
// GET signup error page
authRouter.get('/signupError', authController.serveSignupError)
//GET logout page
authRouter.get('/logout', authController.serveLogout)
// POST a logout attempt
authRouter.post('/logout', authController.logout)

module.exports = authRouter