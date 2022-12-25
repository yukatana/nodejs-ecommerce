const config = require('../config')
const { logger } = require('../../logs')

module.exports = class DatabaseConnections {
    //connection to mongoDB and/or firebase is only required when it's specified in .env
    static cartsDatabase = config.CARTS_DATABASE
    static productsDatabase = config.PRODUCTS_DATABASE

    constructor() {}

    static connect = async () => {
        try {
            if (this.cartsDatabase === 'mongoDB' ||
                this.productsDatabase === 'mongoDB') {
                const mongoDBConnection = require('../databases/mongoDB')
                const MongoDBConnection = new mongoDBConnection(config.MONGODB_USERNAME, config.MONGODB_PASSWORD, config.MONGODB_URI, config.MONGODB_DATABASE)
                this.mongoDBConnection = await MongoDBConnection.connect()
                    .then(() => logger.info('Successfully connected to MongoDB database.'))
                    .catch((err) => logger.error(`Could not connect to MongoDB database. Error: ${err}`))
            } else if (this.cartsDatabase === 'firebase' ||
                this.productsDatabase === 'firebase') {
                //Firebase dynamic require: only initializes when it's specified on the .env file
                if (this.cartsDatabase === 'firebase' ||
                    this.productsDatabase === 'firebase') {
                    const admin = require('firebase-admin')
                    const serviceAccount = require('../databases/firebase/yukatana-ecommerce-firebase.json')
                    this.firebaseConnection = admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount)
                    })
                    logger.info('Successfully connected to Firebase database.')
                }
            }
        } catch (err) {
            logger.error(err)
        }
    }

    // available in case we want to access the mongoDB connection object
    static getMongoDBConnection = async () => {
        try {
            if (this.mongoDBConnection) { return this.mongoDBConnection }
            await this.connect()
            return this.mongoDBConnection
        } catch (err) {
            logger.error(err)
        }
    }

    // available in case we want to access the firebase connection object
    static getFirebaseConnection = async () => {
        try {
            if (this.firebaseConnection) { return this.firebaseConnection }
            await this.connect()
            return this.firebaseConnection
        } catch (err) {
            logger.error(err)
        }
    }
}