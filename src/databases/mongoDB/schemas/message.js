const { Schema, model } = require('mongoose')

const MessageSchema = new Schema({
    username: {type: String, required: true},
    type: {type: String, default: 'user'}, // type: 'user' for user questions, type: 'system' for admin responses
    body: {type: String, required: true},
    dateString: {type: String, required: true}
}, {timestamps: true})

const Message = model('messages', MessageSchema)

module.exports = Message