const config = require('../config')
const twilio = require('twilio')
const SID = config.TWILIO_SID
const TOKEN = config.TWILIO_TOKEN
const client = twilio(SID, TOKEN)

const whatsAppOptions = {
    from: `whatsapp:${config.TWILIO_PHONE}`,
    to: `whatsapp:${config.MY_PHONE}`,
    body: ``
}