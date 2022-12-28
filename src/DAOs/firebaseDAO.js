const firebase = require('firebase-admin')
const { logger } = require('../../logs')

class FirebaseDAO {
    constructor(Collection) {
        this.collection = Collection
        this.db = firebase.firestore()
        this.query = this.db.collection(this.collection)
    }

    // Useful for getting document count in order to assign order numbers
    getCount = async () => {
        try {
            const snapshot = this.collection.get()
            return snapshot.data().count
        } catch (err) {
            logger.error(err)
        }
    }

    save = async (object) => {
        try {
            const docs = this.query.doc()
            await docs.set({id: docs.id, ...object})
            return await this.getById(docs.id)
        } catch (err) {
            logger.info(err)
        }
    }

    updateItem = async (id, item) => { //updates a single document in the collection. data param is not used
        try {
            const doc = this.query.doc(id)
            // Executed when calling this method for product updates
            return await doc.update(item)
        } catch (err) {
            logger.error(err)
        }
    }

    pushToProperty = async (id, item, property) => {
        try {
            const doc = this.query.doc(id)
            return doc.update({
                [property]: firebase.firestore.FieldValue.arrayUnion(item)
            })
        } catch (err) {
            logger.error(err)
        }
    }

    getById = async (id) => { //returns the object specified by the ID passed as an argument, or null if it does not exist
        try {
            const doc = this.query.doc(id)
            const item = await doc.get()
            if (item) {
                return await item.data()
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
            const querySnapshot = await this.query.get()
            const docs = querySnapshot.docs
            if (docs) {
                return docs.map(doc => {
                    return {
                        id: doc.id,
                        name: doc.data().name,
                        price: doc.data().price,
                        stock: doc.data().stock,
                        thumbnail: doc.data().thumbnail,
                        description: doc.data().description
                    }
                })
            } else {
                return false
            }
        } catch (err) {
            logger.error(err)
        }
    }

    deleteById = async (id) => { //deletes array item (object) specified by ID
        try {
            const exists = await this.getById(id)
            if (exists) {
                await this.query.doc(id).delete()
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

    // First parameter is the ID of the document in this collection, the second is an object with the property's ID and name to delete from - allows re-usability
    deleteFromPropertyById = async (parentId, property) => {
        try {
            const doc = await this.query.doc(parentId)
            const parentReference = await doc.get()
            // the entire product object must be fetched so that it can be passed to arrayRemove
            const itemToDeleteFromParent = await this.db.collection(property.name).doc(property.id).get()
            if (parentReference && itemToDeleteFromParent) {
                await doc.update({
                    products: firebase.firestore.FieldValue.arrayRemove(itemToDeleteFromParent.data())
                })
                logger.info(`Item ID: ${property.id} has been deleted from property '${property.name}'.`)
                return true
            } else {
                logger.info(`Either cart ID: ${parentId} or product ID: ${property.id} does not exist`)
                return null
            }
        } catch (err) {
            logger.error(err)
        }
    }

    deleteAll = async () => { //WARNING! Deletes all documents in the collection, yet not the collection itself
        try {
            this.query.listDocuments()
                .then(docs => docs.map(doc => doc.delete()))
                .then(() => logger.info('All items have been deleted.'))
                .catch(err => logger.error(err))
        } catch (err) {
            logger.error(err)
        }
    }
}

module.exports = FirebaseDAO