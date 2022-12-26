// Message DAO and DTO imports
const MessageDAO = require('../factories/DAOFactory').getMessageDAO()
const { MessageDTO } = require('../DTOs')
const { logger } = require('../../logs')

serveChat = (req, res) => {
    try {
        if (!req.params.email) {
            // Returns all messages when no param is passed
            const allMessages = MessageDAO.getAll()
            const allMessagesToClient = allMessages.map(msg => {return new MessageDTO(msg)})
            return res.render('root.hbs', allMessagesToClient) // guard clause
        }
        const email = req.params.email
        // Filters messages sent by a specific user when a param is passed
        const filteredMessages = MessageDAO.filter('username', email)
        const filteredMessagesToClient = filteredMessages.map(msg => {return new MessageDTO(msg)})
        return res.render('root.hbs', filteredMessagesToClient)
    } catch (err) {
        logger.error(err)
    }
}

module.exports = { serveChat }