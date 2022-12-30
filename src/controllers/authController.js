const config = require('../config')
const twilioService = require('../services/twilio')
const { UserDTO } = require('../DTOs')
const jwt = require('jsonwebtoken')


class AuthController {
    static serveLogin = (req, res) => {
        res.sendFile(process.cwd() + '/src/public/login.html')
    }

    static successfulLogin = async (req, res) => {
        const user = req.user
        const purgedUser = new UserDTO(user)
        // Signing token to send to client along with the information it contains
        const token = jwt.sign({ user: purgedUser }, config.JWT_KEY)
        res.status(200).json({...purgedUser, token})
    }

    static successfulSignup = async (req, res) => {
        const user = req.user
        const purgedUser = new UserDTO(user)
        // Twilio service sends an email to the administrator when a new user has signed up
        await twilioService.sendRegisteredUserEmail(purgedUser.username)
        // Signing token to send to client along with the information it contains
        const token = jwt.sign({ user: purgedUser }, config.JWT_KEY)
        res.status(200).json({...purgedUser, token})
    }

    static serveLoginError = (req, res) => {
        res.status(400).json({error: 'Invalid credentials. Please try again.'})
    }

    static serveSignup = (req, res) => {
        res.sendFile(process.cwd() + '/src/public/signup.html')
    }

    static serveSignupError = (req, res) => {
        res.status(400).json({error: 'Invalid credentials. Please try again.'})
    }

    static serveUnauthorizedMessage = (req, res) => {
        res.status(401).json({error: 'Unauthorized to make this request.'})
    }
}

module.exports = AuthController