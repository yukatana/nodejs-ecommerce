const mongoose = require('mongoose')
const { logger } = require('../../../logs')

// connection class implements singleton design pattern in order to avoid redundant instances
class MongoDBConnection {
    constructor(MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_URI, MONGODB_DATABASE) {
        if (!this.instance) {
            this.MONGODB_USERNAME = MONGODB_USERNAME
            this.MONGODB_PASSWORD = MONGODB_PASSWORD
            this.MONGODB_URI = MONGODB_URI
            this.MONGODB_DATABASE = MONGODB_DATABASE
            this.instance = this
            return this.instance
        } else {
            return this.instance
        }
    }

    connect = async () => {
        try {
            if (!this.connection) {
                const URIString = `mongodb+srv://${this.MONGODB_USERNAME}:${this.MONGODB_PASSWORD}@${this.MONGODB_URI}/${this.MONGODB_DATABASE}`
                this.connection = await mongoose.connect(URIString)
                return this.connection
            }
            return this.connection
        } catch (err) {
            logger.error(err)
        }
    }
}

module.exports = MongoDBConnection