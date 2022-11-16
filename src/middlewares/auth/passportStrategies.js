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
    const userExists = await User.findOne({ username })
    if (userExists) {
         return done(null, false, {message: 'User already exists. Please, register with a different username.'})
    }
    const hashedPassword = hashPassword(password)
    const user = new User({
        username,
        password: hashedPassword,
        name: req.body.name,
        address: req.body.address,
        age: req.body.age,
        phone: req.body.phone,
        avatar: req.body.avatar
    })
    await user.save()
    return done(null, user)
}

module.exports = {
    loginStrategy,
    signupStrategy
}