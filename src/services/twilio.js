const config = require('../config')
const { logger } = require('../../logs')
const twilio = require('twilio')
const SID = config.TWILIO_SID
const TOKEN = config.TWILIO_TOKEN
const client = twilio(SID, TOKEN)
const sendgridMail = require('@sendgrid/mail')
sendgridMail.setApiKey(config.SENDGRID_API_KEY)

sendPurchaseWhatsapp = async (name, username) => {
    try {
        const info = await client.messages.create(
            {
                from: `whatsapp:${config.TWILIO_PHONE}`,
                to: `whatsapp:${config.MY_PHONE}`,
                body: `New purchase from ${username}`
            }
        )
        return logger.info(info)
    } catch (err) {
        logger.error(err)
    }
}

sendPurchaseEmail = async (name, username, cart) => {
    try {
        const productsHTML = cart.products.map(product => {return `<li>Name: ${product.name}, Price: $${product.price}, Qty: ${product.qty}</li>`})
        const productsHTMLString = productsHTML.join('')
        const msg = {
            to: username,
            from: config.MY_EMAIL,
            cc: config.MY_EMAIL,
            subject: `New purchase from ${username}`,
            html: `<h1>User ${username} has purchased cart ID: ${cart._id || cart.id}</h1>
                   <h2>Details:</h2>
                   <h3 style='position: center'>Cart ID: ${cart._id || cart.id}</h3>
                   <h3 style='position: center'>Username: ${cart.username}</h3>
                   <h3 style='position: center'>Delivery address: ${cart.deliveryAddress}</h3>
                   <ul>Products:
                        ${productsHTMLString}
                   </ul>
                   <h3 style='position: center'>Purchased at: ${cart.dateString}</h3>`
        }
        return await sendgridMail.send(msg)
            .then((res) => logger.info(res))
            .catch(err => logger.error(err))
    } catch (err) {
        logger.error(err)
    }
}

sendRegisteredUserEmail = async (username) => {
    const dateString = new Date().toLocaleString()
    try {
        const msg = {
            to: config.MY_EMAIL,
            from: config.MY_EMAIL,
            subject: `New user registered - ${username}`,
            html: `<h1> ${username} has registered in the platform at ${dateString} </h1>`
        }
        return await sendgridMail.send(msg)
            .then((res) => logger.info(res))
            .catch(err => logger.error(err))
    } catch (err) {
        logger.error(err)
    }
}

module.exports = { sendPurchaseWhatsapp, sendPurchaseEmail, sendRegisteredUserEmail }