const config = require('../config')
const { logger } = require('../../logs')

const productsDatabase = config.PRODUCTS_DATABASE
const cartsDatabase = config.CARTS_DATABASE

//Firebase dynamic require: only initializes when it's specified on the .env file
if (config.CARTS_DATABASE === 'firebase' ||
    config.PRODUCTS_DATABASE === 'firebase') {
    const admin = require('firebase-admin')
    const serviceAccount = require('../databases/firebase/yukatana-ecommerce-firebase.json')
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })
}

// Exporting carts DAO instance based on .env config
let cartsDAO
switch (cartsDatabase) {
    case 'memory' :
        const CartsDAOMemory = require('../DAOs/memoryDAO')
        cartsDAO = new CartsDAOMemory()
        break
    case 'file' :
        const CartsDAOFile = require('../DAOs/fileDAO')
        cartsDAO = new CartsDAOFile('./databases/files/carts.json') //path relative to app.js
        break
    case 'mongoDB' :
        //connection to mongoDB is only required when it's specified in .env
        const mongoDBConnection = require('../databases/mongoDB')
        const MongoDBConnection = new mongoDBConnection(config.MONGODB_USERNAME, config.MONGODB_PASSWORD, config.MONGODB_URI, config.MONGODB_DATABASE)
        MongoDBConnection.connect()
            .then(() => logger.info('Successfully connected to carts database.'))
            .catch((err) => logger.error(`Could not connect to carts database. Error: ${err}`))
        const CartsDAOMongoDB = require('../DAOs/mongoDBDAO')
        const Cart = require('../databases/mongoDB/schemas/cart')
        cartsDAO = new CartsDAOMongoDB(Cart)
        break
    case 'firebase' :
        const CartsDAOFirebase = require('../DAOs/firebaseDAO')
        cartsDAO = new CartsDAOFirebase('carts')
        logger.info('Successfully connected to carts database.')
        break
}

// Exporting products DAO instance based on .env config
let productsDAO
switch (productsDatabase) {
    case 'memory' :
        const ProductsDAOMemory = require('../DAOs/memoryDAO')
        productsDAO = new ProductsDAOMemory()
        break
    case 'file' :
        const ProductsDAOFile = require('../DAOs/fileDAO')
        productsDAO = new ProductsDAOFile('./databases/files/products.json') //path relative to app.js
        break
    case 'mongoDB' :
        //connection to mongoDB is only required when it's specified in .env
        const mongoDBConnection = require('../databases/mongoDB')
        const MongoDBConnection = new mongoDBConnection(config.MONGODB_USERNAME, config.MONGODB_PASSWORD, config.MONGODB_URI, config.MONGODB_DATABASE)
        MongoDBConnection.connect()
            .then(() => logger.info('Successfully connected to products database.'))
            .catch((err) => logger.error(`Could not connect to products database. Error: ${err}`))
        const ProductsDAOMongoDB = require('../DAOs/mongoDBDAO')
        const Product = require('../databases/mongoDB/schemas/product')
        productsDAO = new ProductsDAOMongoDB(Product)
        break
    case 'firebase' :
        const ProductsDAOFirebase = require('../DAOs/firebaseDAO')
        productsDAO = new ProductsDAOFirebase('products')
        logger.info('Successfully connected to products database.')
        break
}

module.exports = {
    cartsDAO,
    productsDAO
}