const config = require('../config')
const twilioService = require('../services/twilio')
const { UserDTO } = require('../DTOs')
const jwt = require('jsonwebtoken')

serveLogin = (req, res) => {
    res.sendFile(process.cwd() + '/src/public/login.html')
}

saveSuccessfulAuthentication = async (req, res) => {
    // Twilio service sends an email to the administrator when a new user has signed up
    await twilioService.sendRegisteredUserEmail()
    const user = req.user
    const purgedUser = new UserDTO(user)
    const token = jwt.sign({ user: purgedUser }, config.JWT_KEY)
    res.status(200).json({...purgedUser, token})
}

serveLoginError = (req, res) => {
    res.sendFile(process.cwd() + '/src/public/loginError.html')
}

serveSignup = (req, res) => {
    res.sendFile(process.cwd() + '/src/public/signup.html')
}

serveSignupError = (req, res) => {
    res.sendFile(process.cwd() + '/src/public/signupError.html')
}

// DEPRECATED SINCE AUTHENTICATION IS NOW BASED ON JWT
logout = (req, res) => {
    req.session.destroy()
    req.logout(() => res.redirect('/auth/logout'))
}

serveLogout = (req, res) => {
    res.sendFile(process.cwd() + '/src/public/logout.html')
}

module.exports = {
    saveSuccessfulAuthentication,
    serveLogin,
    serveLoginError,
    serveSignup,
    serveSignupError,
    serveLogout,
    logout
}