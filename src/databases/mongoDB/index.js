const mongoose = require('mongoose')
require('dotenv').config()

connection = async () => {
    const URIString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URI}/${process.env.MONGODB_DATABASE}`
    await mongoose.connect(URIString)
}

module.exports = connection