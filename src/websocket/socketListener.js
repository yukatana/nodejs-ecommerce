const { logger } = require('../../logs')

// SocketServer and events import
const { Server: SocketServer } = require('socket.io')
const events = require('./socketEvents')

// Message DAO and DTO imports
const MessageDAO = require('../factories/DAOFactory').getMessageDAO()
const { MessageDTO } = require('../DTOs')

module.exports = socketListener = (httpServer) => {
    const socketServer = new SocketServer(httpServer)

    socketServer.on('connection',  async (socket) => {
        logger.info('A new client has connected to the websocket channel.')

        // Initial emission of all messages for the frontend
        const messages = await MessageDAO.getAll()
        const messagesToClient = messages.map(msg => {return new MessageDTO(msg)})
        socketServer.emit(events.MESSAGES_INIT, messagesToClient)

        // New message handler
        socket.on(events.POST_MESSAGE, async (msg) => {
            logger.info(msg)
            await MessageDAO.save(msg)
            const messageToClient = new MessageDTO(msg)
            socketServer.sockets.emit(events.NEW_MESSAGE, messageToClient)
        })
    })
}