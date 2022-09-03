require('dotenv').config()
const productsDatabase = process.env.PRODUCTS_DATABASE
const cartsDatabase = process.env.CARTS_DATABASE

// Data Access Objects import for carts
const CartsDAOmemory = require('./carts/cartsDAOmemory')
const CartsDAOfile = require('./carts/cartsDAOfile')
const CartsDAOmongoDB = require('./carts/cartsDAOmongoDB')
const CartsDAOfirebase = require('./carts/cartsDAOfirebase')

// Data Access Objects import for products
const ProductsDAOmemory = require('./products/productsDAOmemory')
const ProductsDAOfile = require('./products/productsDAOfile')
const ProductsDAOmongoDB = require('./products/productsDAOmongoDB')
const ProductsDAOfirebase = require('./products/productsDAOfirebase')

// Exporting products DAO instance based on .env config
switch (productsDatabase) {
    case 'memory' :
        module.exports = new ProductsDAOmemory()
        break
    case 'file' :
        module.exports = new ProductsDAOfile()
        break
    case 'mongoDB' :
        module.exports = new ProductsDAOmongoDB()
        break
    case 'firebase' :
        module.exports = new ProductsDAOfirebase()
        break
}

// Exporting carts DAO instance based on .env config
switch (cartsDatabase) {
    case 'memory' :
        module.exports = new CartsDAOmemory()
        break
    case 'file' :
        module.exports = new CartsDAOfile()
        break
    case 'mongoDB' :
        module.exports = new CartsDAOmongoDB()
        break
    case 'firebase' :
        module.exports = new CartsDAOfirebase()
        break
}