// Message DAO and DTO imports
const MessageDAO = require('../factories/DAOFactory').getMessageDAO()
const { MessageDTO } = require('../DTOs')
const { logger } = require('../../logs')

serveChat = async (req, res) => {
    try {
        if (!req.params.email) {
            // Returns all messages when no param is passed
            const allMessages = await MessageDAO.getAll()
            let allMessagesToClient
            // Triggered when there is no data in the message database, as false is returned from the DAO
            if (allMessages === false) {
                allMessagesToClient = {}
                return res.render('chat.hbs', allMessagesToClient) // guard clause
            }
            allMessagesToClient = allMessages.map(msg => {return new MessageDTO(msg)})
            logger.info(allMessagesToClient)
            // Messages must be passed as an object with key "messages" in order for handlebars to render properly
            return res.render('chat.hbs', { messages: allMessagesToClient })
        }
        const email = req.params.email
        // Filters messages sent by a specific user when a param is passed
        const filteredMessages = await MessageDAO.filter('username', email)
        // The filter method returns null when no matches are found, so an empty object is sent
        if (filteredMessages === null) {
            return res.render('chat.hbs', {})
        }
        const filteredMessagesToClient = filteredMessages.map(msg => {return new MessageDTO(msg)})
        return res.render('chat.hbs', {messages: filteredMessagesToClient})
    } catch (err) {
        logger.error(err)
    }
}

module.exports = { serveChat }