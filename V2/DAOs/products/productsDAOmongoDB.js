const mongoDBontainer = require('../../containers/mongoDBcontainer')

class productsDAOmongoDB extends mongoDBcontainer {
    constructor() {
        super()
    }
}

module.exports = productsDAOmongoDB