const config = require('../config')
const { logger } = require('../../logs')

module.exports = class DAOFactory {
    constructor() {}

    static getCartsDAO = () => {
        if (this.cartsDAO) {
            return this.cartsDAO
        }
        switch (config.CARTS_DATABASE) {
            case 'memory' :
                const CartsDAOMemory = require('../DAOs/memoryDAO')
                this.cartsDAO = new CartsDAOMemory()
                return this.cartsDAO
                break
            case 'file' :
                const CartsDAOFile = require('../DAOs/fileDAO')
                this.cartsDAO = new CartsDAOFile('./databases/files/carts.json') //path relative to app.js
                return this.cartsDAO
                break
            case 'mongoDB' :
                const CartsDAOMongoDB = require('../DAOs/mongoDBDAO')
                const CartModel = require('../databases/mongoDB/schemas/cart')
                this.cartsDAO = new CartsDAOMongoDB(CartModel)
                return this.cartsDAO
                break
            case 'firebase' :
                const CartsDAOFirebase = require('../DAOs/firebaseDAO')
                this.cartsDAO = new CartsDAOFirebase('carts')
                logger.info('Successfully connected to carts database.')
                return this.cartsDAO
                break
            default:
                logger.error(`Fatal error: please adjust CARTS_DATABASE environment variable to match a supported persistence mechanism.`)
        }
    }

    static getProductsDAO = () => {
        if (this.productsDAO) {
            return this.productsDAO
        }
        switch (config.PRODUCTS_DATABASE) {
            case 'memory' :
                const ProductsDAOMemory = require('../DAOs/memoryDAO')
                this.productsDAO = new ProductsDAOMemory()
                return this.productsDAO
                break
            case 'file' :
                const ProductsDAOFile = require('../DAOs/fileDAO')
                this.productsDAO = new ProductsDAOFile('./databases/files/products.json') //path relative to app.js
                return this.productsDAO
                break
            case 'mongoDB' :
                const ProductsDAOMongoDB = require('../DAOs/mongoDBDAO')
                const ProductModel = require('../databases/mongoDB/schemas/product')
                this.productsDAO = new ProductsDAOMongoDB(ProductModel)
                return this.productsDAO
                break
            case 'firebase' :
                const ProductsDAOFirebase = require('../DAOs/firebaseDAO')
                this.productsDAO = new ProductsDAOFirebase('products')
                logger.info('Successfully connected to products database.')
                return this.productsDAO
                break
            default:
                logger.error(`Fatal error: please adjust PRODUCTS_DATABASE environment variable to match a supported persistence mechanism.`)
        }
    }
}