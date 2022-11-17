const app = require('../app')
const config = require('../config')
const session = require('express-session')
const MongoStore = require('connect-mongo')
app.use(session({
    store: new MongoStore({
        mongoUrl: `mongodb+srv://${config.MONGODB_USERNAME}:${config.MONGODB_PASSWORD}@${config.MONGODB_URI}/${config.MONGODB_SESSIONS}`,
        ttl: 60 * 10
    }),
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

serveLogin = (req, res) => {
    res.sendFile(__dirname + '/public/login.html')
}

saveSession = (req, res) => {
    req.session.user = req.user
    res.redirect('/')
}

serveLoginError = (req, res) => {
    res.sendFile(__dirname + '/public/loginError.html')
}

serveSignup = (req, res) => {
    res.sendFile(__dirname + '/public/signup.html')
}

serveSignupError = (req, res) => {
    res.sendFile(__dirname + '/public/signupError.html')
}

logout = (req, res) => {
    req.session.destroy()
    req.logout(() => res.redirect('/auth/logout'))
}

serveLogout = (req, res) => {
    res.sendFile(__dirname + '/public/logout.html')
}

module.exports = {
    saveSession,
    serveLogin,
    serveLoginError,
    serveSignup,
    serveSignupError,
    serveLogout,
    logout
}