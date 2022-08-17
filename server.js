const express = require('express')
const APIrouter = require('./routes/router')

const app = express()
const PORT = 8080

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static(__dirname + '/public'))
app.use('/api/products', APIrouter)

const server = app.listen(PORT, () => {
    console.log(`Express HTTP server running on port ${PORT}`)
})

app.use('*', (req, res) => {
    res.status(404).json({404: `NOT FOUND: Route ${req.path} for method ${req.method} does not exist`})
})

server.on('error', error => console.log(`Server error: ${error}`))