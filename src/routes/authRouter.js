const { Router } = require('express')
const authRouter = Router()
const { passportSignup, passportLogin } = require('../middlewares/auth/passport')
const AuthController = require('../controllers/authController')

// GET login form
authRouter.get('/login', AuthController.serveLogin)
// POST a login attempt
authRouter.post('/login', passportLogin, AuthController.successfulLogin)
// GET login error page
authRouter.get('/loginError', AuthController.serveLoginError)
// GET signup form
authRouter.get('/signup', AuthController.serveSignup)
// POST a signup attempt
authRouter.post('/signup', passportSignup, AuthController.successfulSignup)
// GET signup error page
authRouter.get('/signupError', AuthController.serveSignupError)
// GET unauthorized request page
authRouter.get('/unauthorized', AuthController.serveUnauthorizedMessage)
//GET logout page
authRouter.get('/logout', AuthController.serveLogout)
// POST a logout attempt
authRouter.post('/logout', AuthController.logout)

module.exports = authRouter