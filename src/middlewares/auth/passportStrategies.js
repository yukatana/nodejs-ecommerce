const config = require('../../config')
const { logger } = require('../../../logs')
const User = require('../../databases/mongoDB/schemas/user')
const { comparePassword, hashPassword } = require('../../utils/bcrypt')

const loginStrategy = async (username, password, done) => {
    const user = await User.findOne({username})
    const hashedPassword = user?.password
    if (!user || !comparePassword(password, hashedPassword)) {
        return done(null, false, {message: 'Invalid username and/or password. Please try again.'})
    }
    return done(null, user)
}

const signupStrategy = async (req, username, password, done) => {
    try {
        const userExists = await User.findOne({ username })
        if (userExists) {
            return done(null, false, {message: 'User already exists. Please, register with a different username.'})
        }
        const hashedPassword = hashPassword(password)
        const user = new User({
            username,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            phone: req.body.phone,
        })
        await user.save()
        return done(null, user)
    } catch (err) {
        logger.error(err)
        return done(err)
    }
}

// setting up JWT functionality
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt')
const jwtStrategy = new JWTStrategy({
    secretOrKey: config.JWT_KEY,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
    try {
        logger.info(token)
        return done(null, token)
    } catch (err) {
        logger.error(err)
    }
})

module.exports = {
    loginStrategy,
    signupStrategy,
    jwtStrategy
}