const express = require('express')
const productsRouter = require('./routes/products-router')
const cartRouter = require('./routes/cart-router')

const app = express()
const PORT = process.env.PORT || 8080

app.use(express.urlencoded({extended: true}));
app.use(express.json());

//app.use(express.static(__dirname + '/public'))
app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)

const server = app.listen(PORT, () => {
    console.log(`Express HTTP server running on port ${PORT}`)
})

app.use('*', (req, res) => {
    res.status(404).json({404: `NOT FOUND: Route ${req.originalUrl} for method ${req.method} does not exist`})
})

server.on('error', error => console.log(`Server error: ${error}`))