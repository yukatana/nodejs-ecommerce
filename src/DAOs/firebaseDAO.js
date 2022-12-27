const firebase = require('firebase-admin')
const { logger } = require('../../logs')

class FirebaseDAO {
    constructor(Collection) {
        this.collection = Collection
        this.db = firebase.firestore()
        this.query = this.db.collection(this.collection)
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
            if (this.collection === 'products') {
                return await doc.update(item) //executed when calling this method for product updates
            } else if (this.collection === 'carts') {
                return doc.update({
                    products: firebase.firestore.FieldValue.arrayUnion(item)
                })
            }
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

    deleteFromCartById = async (cartId, productId) => {
        try {
            const doc = await this.query.doc(cartId)
            const cart = await doc.get()
            // the entire product object must be fetched so that it can be passed to arrayRemove
            const product = await this.db.collection('products').doc(productId).get()
            logger.info(product)
            if (product && cart) {
                await doc.update({
                    products: firebase.firestore.FieldValue.arrayRemove(product.data())
                })
                logger.info('The item containing the specified ID has been deleted.')
                return true
            } else {
                logger.info(`Either cart ID: ${cartId} or product ID: ${productId} does not exist`)
                return false

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