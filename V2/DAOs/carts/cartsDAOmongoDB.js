const MongoDBcontainer = require('../../containers/mongoDBcontainer')

class CartsDAOmongoDB extends MongoDBcontainer {
    constructor() {
        super()
    }
}

module.exports = CartsDAOmongoDB