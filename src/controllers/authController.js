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