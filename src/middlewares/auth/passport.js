const config = require('../../config')
const { logger } = require('../../../logs')

// Passport import, initialization, and configuration
const passport = require('passport')
const { loginStrategy, signupStrategy } = require('../../middlewares/auth/passportStrategies')
const LocalStrategy = require('passport-local').Strategy
passport.use('login', new LocalStrategy(loginStrategy))
passport.use('signup', new LocalStrategy(
    {passReqToCallback: true},
    signupStrategy)
)

// setting up JWT functionality
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt')
passport.use(new JWTStrategy({
        secretOrKey: config.JWT_KEY,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }, async (token, done) => {
        try {
            return done(null, token.user)
        } catch (err) {
            logger.error(err)
        }
    })
)

// Types and User schema to be used by deserialize
const { Types } = require('mongoose')
const User = require('../../databases/mongoDB/schemas/user')
passport.serializeUser((user, done) => {
    done(null, user._id)
})
passport.deserializeUser(async (id, done) => {
    id = Types.ObjectId(id)
    const user = await User.findById(id)
    done(null, user)
})

const passportSignup = passport.authenticate('signup',
    {failureRedirect: '/auth/signupError'})

const passportLogin = passport.authenticate('login',
    {failureRedirect: '/auth/loginError'})

const passportJWT = passport.authenticate('jwt',
    {session: false})

module.exports = {
    passport,
    passportSignup,
    passportLogin,
    passportJWT
}