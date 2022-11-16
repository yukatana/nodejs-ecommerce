const User = require('../databases/mongoDB/schemas/user')

const verifyUsername = async (username) => {
    return await User.findOne({username})
}

module.exports = verifyUsername