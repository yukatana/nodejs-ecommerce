const { Router } = require('express')
const authRouter = Router()
const {
    serveLogin,
    tryLogin,
    serveSignup,
    trySignup,
    logout
} = require('../controllers/authController')

// Passport import, initialization, and configuration
const passport = require('passport')
const { loginStrategy, signupStrategy } = require('../middlewares/auth/passportStrategies')
const LocalStrategy = require('passport-local').Strategy
passport.use('login', new LocalStrategy(loginStrategy))
passport.use('signup', new LocalStrategy(
    {passReqToCallback: true},
    signupStrategy)
)

// Importing express app in order to pass passport middlewares
const app = require('../app')
app.use(passport.initialize())
app.use(passport.session())

// GET login form
authRouter.get('/login', serveLogin)
// POST a login attempt
authRouter.post('/login', tryLogin)
// GET signup form
authRouter.get('/signup', serveSignup)
// POST a signup attempt
authRouter.post('/signup', trySignup)
// POST a logout attempt
authRouter.post('/logout', logout)

module.exports = authRouter