const User = require('../databases/mongoDB/schemas/user')

// Verifies that a username actually exists in the database
const verifyUsername = async (username) => {
    return User.findOne({username})
}

// Fetches delivery address from user databases for when carts are created
const getDeliveryAddress = async (username) => {
    return User.findOne({username}, 'deliveryAddress -_id')
}

module.exports = { verifyUsername, getDeliveryAddress }