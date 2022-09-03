require('dotenv').config()
const productsDatabase = process.env.PRODUCTS_DATABASE
const cartsDatabase = process.env.CARTS_DATABASE

// Data Access Objects import for carts
const cartsDAOmemory = require('./carts/cartsDAOmemory')
const cartsDAOfile = require('./carts/cartsDAOfile')
const cartsDAOmongoDB = require('./carts/cartsDAOmongoDB')
const cartsDAOfirebase = require('./carts/cartsDAOfirebase')

// Data Access Objects import for products
const productsDAOmemory = require('./products/productsDAOmemory')
const productsDAOfile = require('./products/productsDAOfile')
const productsDAOmongoDB = require('./products/productsDAOmongoDB')
const productsDAOfirebase = require('./products/productsDAOfirebase')

// Exporting products DAO instance based on .env config
switch (productsDatabase) {
    case 'memory' :
        module.exports = new productsDAOmemory()
        break
    case 'file' :
        module.exports = new productsDAOfile()
        break
    case 'mongoDB' :
        module.exports = new productsDAOmongoDB()
        break
    case 'firebase' :
        module.exports = new productsDAOfirebase()
}

// Exporting carts DAO instance based on .env config
switch (cartsDatabase) {
    case 'memory' :
        module.exports = new cartsDAOmemory()
        break
    case 'file' :
        module.exports = new cartsDAOfile()
        break
    case 'mongoDB' :
        module.exports = new cartsDAOmongoDB()
        break
    case 'firebase' :
        module.exports = new cartsDAOfirebase()
}