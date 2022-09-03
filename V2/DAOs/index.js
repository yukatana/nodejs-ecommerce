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
        cartsDAO = new CartsDAOfile()
        break
    case 'mongoDB' :
        cartsDAO = new CartsDAOmongoDB()
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
        productsDAO= new ProductsDAOfile()
        break
    case 'mongoDB' :
        productsDAO = new ProductsDAOmongoDB()
        break
    case 'firebase' :
        productsDAO = new ProductsDAOfirebase()
        break
}

module.exports = {
    cartsDAO,
    productsDAO
}