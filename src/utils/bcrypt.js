const bcrypt = require('bcrypt')

const hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
}

const comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword)
}

module.exports = {
    hashPassword,
    comparePassword
}