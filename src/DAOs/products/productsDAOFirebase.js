const FirebaseContainer = require('../../containers/firebaseContainer')

class ProductsDAOFirebase extends FirebaseContainer {
    constructor(Product) {
        super(Product)
    }
}

module.exports = ProductsDAOFirebase