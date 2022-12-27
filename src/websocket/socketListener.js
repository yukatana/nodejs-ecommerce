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

        // The only necessary websocket event is POST_MESSAGE since initialization is handled by handlebars in order to allow filtering
        socket.on(events.POST_MESSAGE, async (msg) => {
            logger.info(msg)
            await MessageDAO.save(msg)
            const messageToClient = new MessageDTO(msg)
            socketServer.sockets.emit(events.NEW_MESSAGE, messageToClient)
        })
    })
}