const { Router } = require('express')
const chatRouter = Router()
const chatController =  require('../controllers/chatController')

// GET websocket chat handlebars view
// Email param to filter for a particular user, returns all messages if not param is passed
chatRouter.get('/:email?', chatController.serveChat)

module.exports = chatRouter