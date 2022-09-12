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

// Exporting carts DAO instance based on .env config
let cartsDAO
switch (cartsDatabase) {
    case 'memory' :
        cartsDAO = new CartsDAOmemory()
        break
    case 'file' :
        cartsDAO = new CartsDAOfile('./databases/files/carts.json') //path relative to server.js
        break
    case 'mongoDB' :
        const Cart = require('../databases/mongoDB/schemas/cart')
        cartsDAO = new CartsDAOmongoDB(Cart)
        //connection to mongoDB is only required when it's specified in .env
        const connectToMongoDB = require('../databases/mongoDB')
        connectToMongoDB()
            .then(() => console.log('Successfully connected to carts database.'))
            .catch((err) => console.log(`Could not connect to carts database. Error: ${err}`))
        break
    case 'firebase' :
        cartsDAO = new CartsDAOfirebase()
        break
}
// Exporting products DAO instance based on .env config
let productsDAO
switch (productsDatabase) {
    case 'memory' :
         productsDAO = new ProductsDAOmemory()
        break
    case 'file' :
        productsDAO= new ProductsDAOfile('./databases/files/products.json') //path relative to server.js
        break
    case 'mongoDB' :
        const Product = require('../databases/mongoDB/schemas/product')
        productsDAO = new ProductsDAOmongoDB(Product)
        //connection to mongoDB is only required when it's specified in .env
        const connectToMongoDB = require('../databases/mongoDB')
        connectToMongoDB()
            .then(() => console.log('Successfully connected to products database.'))
            .catch((err) => console.log(`Could not connect to products database. Error: ${err}`))
        break
    case 'firebase' :
        productsDAO = new ProductsDAOfirebase()
        break
}

module.exports = {
    cartsDAO,
    productsDAO
}