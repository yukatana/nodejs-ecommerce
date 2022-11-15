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

serveLogin = () => {

}

tryLogin = (req, res) => {
    req.session.user = req.user.username
    res.redirect('/')
}

serveSignup = () => {

}

trySignup = (req, res) => {
    req.session.user = req.user.username
    res.redirect('/')
}

logout = (req, res) => {
    req.session.destroy()
    req.logout(() => res.redirect('/auth/logout'))
}

module.exports = {
    serveLogin,
    tryLogin,
    serveSignup,
    trySignup,
    logout
}