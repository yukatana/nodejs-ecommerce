const MongoDBcontainer = require('../../containers/mongoDBcontainer')

class CartsDAOmongoDB extends MongoDBcontainer {
    constructor(Cart) {
        super(Cart)
    }
}

module.exports = CartsDAOmongoDB