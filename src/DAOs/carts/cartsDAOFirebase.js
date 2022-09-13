const FirebaseContainer = require('../../containers/firebaseContainer')

class CartsDAOFirebase extends FirebaseContainer {
    constructor(Cart) {
        super(Cart)
    }
}

module.exports = CartsDAOFirebase