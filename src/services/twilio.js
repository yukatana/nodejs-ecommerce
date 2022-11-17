const config = require('../config')
const twilio = require('twilio')
const SID = config.TWILIO_SID
const TOKEN = config.TWILIO_TOKEN
const client = twilio(SID, TOKEN)


sendPurchaseWhatsapp = async (name, username) => {
    const info = await client.messages.create(
        {
            from: `whatsapp:${config.TWILIO_PHONE}`,
            to: `whatsapp:${config.MY_PHONE}`,
            body: `New purchase from ${name} - ${username}`
        }
    )
    //logger.info(info)
}

sendPurchaseEmail = (req, res, next) => {

}

module.exports = { sendPurchaseWhatsapp, sendPurchaseEmail }