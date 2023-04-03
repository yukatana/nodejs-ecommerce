const { Router } = require('express')
const authRouter = Router()
const { passportSignup, passportLogin } = require('../middlewares/auth/passport')
const AuthController = require('../controllers/authController')

// GET login form
authRouter.get('/login', AuthController.serveLogin)
// POST a login attempt
authRouter.post('/login', passportLogin, AuthController.successfulLogin)
// GET login error page through USE so that redirected requests serve 400 regardless of method
authRouter.use('/loginError', AuthController.serveLoginError)
// GET signup form
authRouter.get('/signup', AuthController.serveSignup)
// POST a signup attempt
authRouter.post('/signup', passportSignup, AuthController.successfulSignup)
// GET signup error page through USE so that redirected requests serve 400 regardless of method
authRouter.use('/signupError', AuthController.serveSignupError)
// GET unauthorized request page through USE so that redirected requests serve 400 regardless of method
authRouter.use('/unauthorized', AuthController.serveUnauthorizedMessage)

module.exports = authRouter