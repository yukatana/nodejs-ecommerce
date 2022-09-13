const firebase = require('firebase-admin')
const {Types} = require("mongoose");

class FirebaseContainer {
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
            console.log(err)
        }
    }

    updateItem = async (data, id, item) => { //updates a single document in the collection. data param is not used
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
            console.log(err)
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
            console.error(err)
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
            console.error(err)
        }
    }

    deleteById = async (id) => { //deletes array item (object) specified by ID
        try {
            const exists = await this.getById(id)
            if (exists) {
                await this.query.doc(id).delete()
                console.log('The item containing the specified ID has been deleted.')
                return true
            } else {
                console.log('The specified ID does not match any items.')
                return false
            }
        } catch (err) {
            console.error(err)
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
                console.log(`Either cart ID: ${cartId} does not exist, or product ID: ${productId} is not in that cart`)
                return false
            } else {
                console.log('The item containing the specified ID has been deleted.')
                return true
            }
        } catch (err) {
            console.log(err)
        }
    }

    deleteAll = async () => { //WARNING! Deletes all documents in the collection, yet not the collection itself
        try {
            this.query.listDocuments()
                .then(docs => docs.map(doc => doc.delete()))
                .then(console.log('All items have been deleted.'))
                .catch(err => console.log(err))
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = FirebaseContainer