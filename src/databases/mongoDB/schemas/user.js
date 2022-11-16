const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    address: {type: String, required: true},
    age: {type: String, required: true},
    phone: {type: String, required: true},
    avatar: {type: String, required: true}
}, {timestamps: true})

const User = model('users', UserSchema)

module.exports = User