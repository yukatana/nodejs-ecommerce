require('dotenv').config()

const productsDatabase = process.env.PRODUCTS_DATABASE
const cartsDatabase = process.env.CARTS_DATABASE

// Data Access Objects import for carts
const CartsDAOMemory = require('./carts/cartsDAOMemory')
const CartsDAOFile = require('./carts/cartsDAOFile')
const CartsDAOMongoDB = require('./carts/cartsDAOMongoDB')
const CartsDAOFirebase = require('./carts/cartsDAOFirebase')

// Data Access Objects import for products
const ProductsDAOMemory = require('./products/productsDAOMemory')
const ProductsDAOFile = require('./products/productsDAOFile')
const ProductsDAOMongoDB = require('./products/productsDAOMongoDB')
const ProductsDAOFirebase = require('./products/productsDAOFirebase')

//Firebase dynamic require: only initializes when it's specified on the .env file
if (process.env.CARTS_DATABASE === 'firebase' ||
    process.env.PRODUCTS_DATABASE === 'firebase') {
    const admin = require("firebase-admin")
    const serviceAccount = require("../databases/firebase/yukatana-ecommerce-firebase.json")
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })
}

// Exporting carts DAO instance based on .env config
let cartsDAO
switch (cartsDatabase) {
    case 'memory' :
        cartsDAO = new CartsDAOMemory()
        break
    case 'file' :
        cartsDAO = new CartsDAOFile('./databases/files/carts.json') //path relative to app.js
        break
    case 'mongoDB' :
        const Cart = require('../databases/mongoDB/schemas/cart')
        cartsDAO = new CartsDAOMongoDB(Cart)
        //connection to mongoDB is only required when it's specified in .env
        const connectToMongoDB = require('../databases/mongoDB')
        connectToMongoDB()
            .then(() => console.log('Successfully connected to carts database.'))
            .catch((err) => console.log(`Could not connect to carts database. Error: ${err}`))
        break
    case 'firebase' :
        cartsDAO = new CartsDAOFirebase('carts')
        console.log('Successfully connected to carts database.')
        break
}
// Exporting products DAO instance based on .env config
let productsDAO
switch (productsDatabase) {
    case 'memory' :
         productsDAO = new ProductsDAOMemory()
        break
    case 'file' :
        productsDAO= new ProductsDAOFile('./databases/files/products.json') //path relative to app.js
        break
    case 'mongoDB' :
        const Product = require('../databases/mongoDB/schemas/product')
        productsDAO = new ProductsDAOMongoDB(Product)
        //connection to mongoDB is only required when it's specified in .env
        const connectToMongoDB = require('../databases/mongoDB')
        connectToMongoDB()
            .then(() => console.log('Successfully connected to products database.'))
            .catch((err) => console.log(`Could not connect to products database. Error: ${err}`))
        break
    case 'firebase' :
        productsDAO = new ProductsDAOFirebase('products')
        console.log('Successfully connected to products database.')
        break
}

module.exports = {
    cartsDAO,
    productsDAO
}