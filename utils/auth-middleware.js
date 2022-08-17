//Admin boolean set as true for testing purposes
let admin = true

const authMiddleware = (req, res, next) => {
    if (admin) {
        return next()
    } else {
        res.status(401).json({
            error: -1,
            description: `Route ${req.path} method ${req.method} - not authorized.`
        })
    }
}

module.exports = authMiddleware
