//MongoDB-based data persistence class. Each instance is loaded using a different Schema with mongoose, hence making it reusable
const { Types } = require('mongoose')

class MongoDBcontainer {
    constructor(Schema) {
        this.Schema = Schema
    }

    save = async (object) => {
        try {
            delete object.timestamp //deletes controller-created timestamp, since mongoDB adds its own
            return await new this.Schema(object)
                .save()
        } catch (err) {
            console.log(err)
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
            console.log(err)
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
            console.error(err)
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
            console.error(err)
        }
    }

    deleteById = async (id) => { //deletes array item (object) specified by ID
        try {
            id = Types.ObjectId(id)
            const success = await this.Schema
                .deleteOne({_id: id})
            if (success) {
                console.log("The item containing the specified ID has been deleted.")
                return true
            } else {
                console.log("The specified ID does not match any items.")
                return false
            }
        } catch (err) {
            console.error(err)
        }
    }

    deleteAll = async () => { //WARNING! Deletes all documents in the collection, yet not the collection itself
        try {
            this.Schema
                .remove({})
            console.log("All items have been deleted.")
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = MongoDBcontainer