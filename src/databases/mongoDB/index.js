const mongoose = require('mongoose')
require('dotenv').config()

connection = async () => {
    const URIString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@yukatana.la8n0bl.mongodb.net/eCommerce`
    await mongoose.connect(URIString)
}

module.exports = connection