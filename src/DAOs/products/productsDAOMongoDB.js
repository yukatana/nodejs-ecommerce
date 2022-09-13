const MongoDBcontainer = require('../../containers/mongoDBContainer')

class ProductsDAOMongoDB extends MongoDBcontainer {
    constructor(Product) {
        super(Product)
    }
}

module.exports = ProductsDAOMongoDB