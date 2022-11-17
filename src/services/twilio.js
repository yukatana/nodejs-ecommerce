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

sendPurchaseEmail = (name, username, cart) => {
    const msg = {
        to: config.MY_EMAIL,
        from: config.MY_EMAIL,
        subject: `New purchase from ${name} - ${username}`,
        html: `${cart}`
    }
    sendgridMail.send(msg)
        .then((res) => logger.info(res))
        .catch(err => logger.error(err))
}

sendRegisteredUserEmail = (req, res, next) => {
    const msg = {
        to: config.MY_EMAIL,
        from: config.MY_EMAIL,
        subject: `New user registered - ${req.user.username}`
    }
    sendgridMail.send(msg)
        .then((res) => logger.info(res))
        .catch(err => logger.error(err))
    next()
}

module.exports = { sendPurchaseWhatsapp, sendPurchaseEmail, sendRegisteredUserEmail }