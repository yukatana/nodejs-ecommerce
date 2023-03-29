const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    address: {type: String, required: false, default: null},
    phone: {type: String, required: false, default: null},
    carts: {type: Array, default: []}
}, {timestamps: true})

const User = model('users', UserSchema)

module.exports = User