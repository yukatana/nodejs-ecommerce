const MongoDBcontainer = require('../../containers/mongoDBContainer')

class CartsDAOMongoDB extends MongoDBcontainer {
    constructor(Cart) {
        super(Cart)
    }
}

module.exports = CartsDAOMongoDB