const config = require('../config')
const { logger } = require('../../logs')
const twilio = require('twilio')
const SID = config.TWILIO_SID
const TOKEN = config.TWILIO_TOKEN
const client = twilio(SID, TOKEN)
const sendgridMail = require('@sendgrid/mail')
sendgridMail.setApiKey(config.SENDGRID_API_KEY)

sendPurchaseWhatsapp = async (name, username) => {
    const info = await client.messages.create(
        {
            from: `whatsapp:${config.TWILIO_PHONE}`,
            to: `whatsapp:${config.MY_PHONE}`,
            body: `New purchase from ${name} - ${username}`
        }
    )
    return logger.info(info)
}

sendPurchaseEmail = () => {

}

sendRegisteredUserEmail = (message) => {
    sendgridMail.send(message)
        .then((res) => logger.info(res))
        .catch(err => logger.error(err))
}

module.exports = { sendPurchaseWhatsapp, sendPurchaseEmail }