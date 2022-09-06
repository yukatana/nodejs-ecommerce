const MongoDBcontainer = require('../../containers/mongoDBcontainer')

class ProductsDAOmongoDB extends MongoDBcontainer {
    constructor(Product) {
        super(Product)
    }
}

module.exports = ProductsDAOmongoDB