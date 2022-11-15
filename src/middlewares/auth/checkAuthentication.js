const checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.status(401).json({
            error: -1,
            description: `Route ${req.originalUrl} method ${req.method} - not authorized.`
        })
    }
}

module.exports = checkAuthentication