const config = require('../config')
const { logger } = require('../../logs')

module.exports = class DAOFactory {
    constructor() {}

    static getCartDAO = () => {
        if (this.cartsDAO) {
            return this.cartsDAO
        }
        switch (config.CART_DATABASE) {
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
            case 'mongodb' :
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
                logger.error(`Fatal error: please adjust CART_DATABASE environment variable to match a supported persistence mechanism.`)
        }
    }

    static getProductDAO = () => {
        if (this.productsDAO) {
            return this.productsDAO
        }
        switch (config.PRODUCT_DATABASE) {
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
            case 'mongodb' :
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
                logger.error(`Fatal error: please adjust PRODUCT_DATABASE environment variable to match a supported persistence mechanism.`)
        }
    }

    static getMessageDAO = () => {
        if (this.messageDAO) {
            return this.messageDAO
        }
        switch (config.MESSAGE_DATABASE) {
            case 'memory' :
                const MessageDAOMemory = require('../DAOs/memoryDAO')
                this.messageDAO = new MessageDAOMemory()
                return this.messageDAO
                break
            case 'file' :
                const MessageDAOFile = require('../DAOs/fileDAO')
                this.messageDAO = new MessageDAOFile('./databases/files/messages.json') //path relative to app.js
                return this.messageDAO
                break
            case 'mongodb' :
                const MessageDAOMongoDB = require('../DAOs/mongoDBDAO')
                const MessageModel = require('../databases/mongoDB/schemas/message')
                this.messageDAO = new MessageDAOMongoDB(MessageModel)
                return this.messageDAO
                break
            case 'firebase' :
                const MessageDAOFirebase = require('../DAOs/firebaseDAO')
                this.messageDAO = new MessageDAOFirebase('messages')
                logger.info('Successfully connected to message database.')
                return this.messageDAO
                break
            default:
                logger.error(`Fatal error: please adjust MESSAGE_DATABASE environment variable to match a supported persistence mechanism.`)
        }
    }

    static getOrderDAO = () => {
        if (this.orderDAO) {
            return this.orderDAO
        }
        switch (config.ORDER_DATABASE) {
            case 'memory' :
                const OrderDAOMemory = require('../DAOs/memoryDAO')
                this.orderDAO = new OrderDAOMemory()
                return this.orderDAO
                break
            case 'file' :
                const OrderDAOFile = require('../DAOs/fileDAO')
                this.orderDAO = new OrderDAOFile('./databases/files/orders.json') //path relative to app.js
                return this.orderDAO
                break
            case 'mongodb' :
                const OrderDAOMongoDB = require('../DAOs/mongoDBDAO')
                const OrderModel = require('../databases/mongoDB/schemas/order')
                this.orderDAO = new OrderDAOMongoDB(OrderModel)
                return this.orderDAO
                break
            case 'firebase' :
                const OrderDAOFirebase = require('../DAOs/firebaseDAO')
                this.orderDAO = new OrderDAOFirebase('orders')
                logger.info('Successfully connected to order database.')
                return this.orderDAO
                break
            default:
                logger.error(`Fatal error: please adjust ORDER_DATABASE environment variable to match a supported persistence mechanism.`)
        }
    }
}