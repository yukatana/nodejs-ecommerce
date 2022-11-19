const path = require('path')

serveLogin = (req, res) => {
    res.sendFile(process.cwd() + '/src/public/login.html')
}

saveSession = (req, res) => {
    req.session.user = req.user
    res.redirect('/')
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

logout = (req, res) => {
    req.session.destroy()
    req.logout(() => res.redirect('/auth/logout'))
}

serveLogout = (req, res) => {
    res.sendFile(process.cwd() + '/src/public/logout.html')
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