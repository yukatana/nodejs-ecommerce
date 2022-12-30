//MongoDB-based data persistence class. Each instance is loaded using a different Schema with mongoose, hence making it reusable
const { Types } = require('mongoose')
const { logger } = require('../../logs')

class MongoDBDAO {
    constructor(model) {
        this.Model = model
    }

    // Useful for getting document count in order to assign order numbers
    getCount = async () => {
        try {
            return await this.Model.countDocuments()
        } catch (err) {
            logger.error(err)
        }
    }

    save = async (object) => {
        try {
            return await new this.Model(object)
                .save()
        } catch (err) {
            logger.error(err)
        }
    }

    updateItem = async (id, item) => { //updates a single document in the collection
        try {
            id = Types.ObjectId(id)
            const result = await this.Model.updateOne({_id: id}, item)
            // Returns null when no match is found for the id param
            if (result.matchedCount === 0) {
                return null
            }
            return result
        } catch (err) {
            logger.error(err)
        }
    }

    // Different from updateItem. Used to push an element to an array inside a document
    pushToProperty = async (id, item, property) => {
        try {
            id = Types.ObjectId(id)
            const document = await this.Model
                .findOne({_id: id})
            document[property].push(item)
            return document.save()
        } catch (err) {
            logger.error(err)
        }
    }

    getById = async (id) => { //returns the object specified by the ID passed as an argument, or null if it does not exist
        try {
            id = Types.ObjectId(id)
            const item = await this.Model
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
            const data = await this.Model
                .find()
            if (data.length === 0) {
                return null
            }
        } catch (err) {
            logger.error(err)
        }
    }

    deleteById = async (id) => { //deletes array item (object) specified by ID
        try {
            id = Types.ObjectId(id)
            const success = await this.Model
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

    // filters a collection by key value pairs, or null if it does not exist
    filter = async (key, value) => {
        try {
            const items = await this.Model
                // dynamic key assignment allows for re-usability
                .find({ [key]: value })
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

    // First parameter is the ID of the document in this collection, the second is an object with the property's ID and name to delete from - allows re-usability
    deleteFromPropertyById = async (parentId, property) => {
        try {
            parentId = Types.ObjectId(parentId)
            property.id = Types.ObjectId(property.id)
            const productToDelete = await this.Model
                .findOne({_id: parentId}, {[property.name]: {_id: property.id}})
            // productToDelete returns an object with an empty array if there is no match
            const result = await this.Model
                .updateOne({_id: parentId}, {
                    $pull: {
                        [property.name]: {_id: property.id}
                    }
                })
            // Executes when there it no match in a given cart for a given product
            if (result.matchedCount === 0 || productToDelete === []) {
                logger.info(`Either cart ID: ${parentId} does not exist, or product ID: ${property.id} is not in that cart`)
                return null
            }
            logger.info('The item containing the specified ID has been deleted.')
            // Returns the updated object when deletion is successful
            return await this.Model.findOne({_id: parentId})
        } catch (err) {
            logger.error(err)
        }
    }

    deleteAll = async () => { //WARNING! Deletes all documents in the collection, yet not the collection itself
        try {
            this.Model
                .remove({})
            logger.info("All items have been deleted.")
        } catch (err) {
            logger.error(err)
        }
    }
}

module.exports = MongoDBDAO