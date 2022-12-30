const express = require('express')
const productsRouter = require('./routes/productsRouter')
const cartRouter = require('./routes/cartsRouter')
const authRouter = require('./routes/authRouter')
const chatRouter = require('./routes/chatRouter')
const cookieParser = require('cookie-parser')
const { warningLogger } = require('../logs')

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())

// Handlebars config import
const hbs = require('../views')
app.engine('hbs', hbs.engine)

// Router declaration
app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)
app.use('/auth', authRouter)
app.use('/chat', chatRouter)

// Info route serves the server's process information
app.get('/info', (req, res) => {
    const processInfo = {
        args: process.argv.splice(2),
        path: process.cwd(),
        operatingSystem: process.platform,
        processId: process.pid,
        title: process.title,
        nodeVersion: process.version,
        folder: __dirname,
        memory: `${process.memoryUsage().rss/1e6} MB`
    }
    res.render('info.hbs', processInfo)
})

app.use(express.static(process.cwd() + '/src/public'))

app.use('*', warningLogger, (req, res) => {
    res.status(404).json({
        error: -2,
        description: `NOT FOUND: Route ${req.originalUrl} for method ${req.method} does not exist`
    })
})

module.exports = app