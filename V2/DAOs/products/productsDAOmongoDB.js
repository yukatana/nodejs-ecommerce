const MongoDBcontainer = require('../../containers/mongoDBcontainer')

class ProductsDAOmongoDB extends MongoDBcontainer {
    constructor() {
        super()
    }
}

module.exports = ProductsDAOmongoDB