//MongoDB-based data persistence class. Each instance is loaded using a different Schema with mongoose, hence making it reusable
const { Types } = require('mongoose')
const { logger } = require('../../logs')

class MongoDBDAO {
    constructor(Schema) {
        this.Schema = Schema
    }

    save = async (object) => {
        try {
            delete object.timestamp //deletes controller-created timestamp, since mongoDB adds its own
            return await new this.Schema(object)
                .save()
        } catch (err) {
            logger.error(err)
        }
    }

    updateItem = async (data, id, item) => { //updates a single document in the collection. data param is not used
        try {
            id = Types.ObjectId(id)
            try {
                await this.Schema.replaceOne({_id: id}, item) //executed when calling this method for product update
            } catch { //executed when calling this method to add a product to a cart
                const cart = await this.Schema
                    .findOne({_id: id})
                cart.products.push(item)
                cart.save()
            }
        } catch (err) {
            logger.error(err)
        }
    }

    getById = async (id) => { //returns the object specified by the ID passed as an argument, or null if it does not exist
        try {
            id = Types.ObjectId(id)
            const item = await this.Schema
                .findOne({_id: id})
            if (item) {
                return item
            }
            else {
                return null
            }
        } catch (err) {
            logger.error(err)
        }
    }

    getAll = async () => { //returns entire collection
        try {
            const data = await this.Schema
                .find()
            if (data) {
                return data
            } else {
                return false
            }
        } catch (err) {
            logger.error(err)
        }
    }

    deleteById = async (id) => { //deletes array item (object) specified by ID
        try {
            id = Types.ObjectId(id)
            const success = await this.Schema
                .deleteOne({_id: id})
            if (success.deletedCount > 0) {
                logger.info('The item containing the specified ID has been deleted.')
                return true
            } else {
                logger.info('The specified ID does not match any items.')
                return false
            }
        } catch (err) {
            logger.error(err)
        }
    }

    deleteFromCartById = async (cartId, productId) => {
        try {
            cartId = Types.ObjectId(cartId)
            productId = Types.ObjectId(productId)
            const isProductInCart = await this.Schema
                .findOne({_id: cartId}, {products: {_id: productId}})
            // console.log(isProductInCart) - returns an object with an empty array if there is no match
            const success = await this.Schema
                .updateOne({_id: cartId}, {
                    $pull: {
                        products: {_id: productId}
                    }
                })
            if (success.matchedCount === 0 || isProductInCart.products.length === 0) {
                logger.info(`Either cart ID: ${cartId} does not exist, or product ID: ${productId} is not in that cart`)
                return false
            } else {
                logger.info('The item containing the specified ID has been deleted.')
                return true
            }
        } catch (err) {
            logger.error(err)
        }
    }

    deleteAll = async () => { //WARNING! Deletes all documents in the collection, yet not the collection itself
        try {
            this.Schema
                .remove({})
            logger.info("All items have been deleted.")
        } catch (err) {
            logger.error(err)
        }
    }

    getByUsername = async (username) => { //returns the object specified by the ID passed as an argument, or null if it does not exist
        try {
            const items = await this.Schema
                .find({ username })
            if (items.length > 0) {
                return items
            }
            else {
                return null
            }
        } catch (err) {
            logger.error(err)
        }
    }
}

module.exports = MongoDBDAO