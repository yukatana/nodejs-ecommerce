const firebase = require('firebase-admin')

class FirebaseContainer {
    constructor(Collection) {
        this.collection = Collection
        this.db = firebase.firestore()
        this.query = this.db.collection(this.collection)
    }

    save = async (object) => {
        try {
            const docs = this.query.doc()
            return await docs.create(object)
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
            id = Types.ObjectId(id)
            const success = await this.Schema
                .deleteOne({_id: id})
            if (success.deletedCount > 0) {
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
}

module.exports = FirebaseContainer