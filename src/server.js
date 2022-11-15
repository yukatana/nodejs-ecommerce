const express = require('express')
const productsRouter = require('./routes/productsRouter')
const cartRouter = require('./routes/cartsRouter')
const authRouter = require('./routes/authRouter')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 8080

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Router declaration
app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)
app.use('/auth', authRouter)

const server = app.listen(PORT, () => {
    console.log(`Express HTTP server running on port ${PORT}`)
})

app.use('*', (req, res) => {
    res.status(404).json({
        error: -2,
        description: `NOT FOUND: Route ${req.originalUrl} for method ${req.method} does not exist`
    })
})

server.on('error', error => console.log(`Server error: ${error}`))