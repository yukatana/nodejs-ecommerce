require('dotenv').config()
const express = require('express')
const productsRouter = require('./routes/productsRouter')
const cartRouter = require('./routes/cartsRouter')
const authRouter = require('./routes/authRouter')
const cookieParser = require('cookie-parser')
const { warningLogger } = require('../logs')
const session = require('express-session')

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())

// passport config import
const { passport } = require('./middlewares/auth/passport')
app.use(passport.initialize())
app.use(passport.session())

// session config import
const { sessionConfig } = require('./middlewares/sessionConfig')
app.use(session(sessionConfig))

// Router declaration
app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)
app.use('/auth', authRouter)

app.use(express.static(__dirname + '/public'))

app.use('*', warningLogger, (req, res) => {
    res.status(404).json({
        error: -2,
        description: `NOT FOUND: Route ${req.originalUrl} for method ${req.method} does not exist`
    })
})

module.exports = app