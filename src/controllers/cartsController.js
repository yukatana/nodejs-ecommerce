const { logger } = require('../../logs')
//returns an instance of a DAO class which extends to the chosen container type
const CartDAO = require('../factories/DAOFactory').getCartDAO()
//necessary since some methods need to access the products database
const ProductDAO = require('../factories/DAOFactory').getProductDAO()
const { CartDTO, ProductDTO, OrderDTO } = require('../DTOs')
const userService = require('../services/userService')
const twilioService = require('../services/twilio')

createCart = async (req, res) => {
    const username = req.params.username
    // Verifies whether the username is in the users MongoDB collection
    if (await userService.verifyUsername(username) === null) {
        return res.status(400).json({error: `Bad request - can't create a cart for an invalid username.`})
    }
    const newCart = await CartDAO.save({
        username,
        products: [],
        dateString: new Date.toLocaleString(),
        deliveryAddress: await userService.getDeliveryAddress()
    })
    return res.status(201).json(new CartDTO(newCart))
}

deleteCartById = async (req, res) => {
    const success = await CartDAO.deleteById(req.params.id)
    success ?
        res.status(200).json({success: `Cart ID: ${req.params.id} has been deleted.`})
        : res.status(404).json({error: 'Cart not found'})
}

getByCartId = async (req, res) => {
    const cart = await CartDAO.getById(req.params.id)
    if (!cart) {
        res.status(404).json({error: 'Cart not found'})
    } else if (cart.products.length === 0) {
        res.status(200).json({empty: `Cart ID: ${req.params.id} is empty.`})
    } else {
        res.status(200).json(cart.products.map(product => { return new ProductDTO(product) }))
    }
}

addProductToCart = async (req, res) => {
    const cartId = req.params.id
    const productId = req.params.productId
    const product = await ProductDAO.getById(productId)
    // Executes only when a corresponding product has been found for the passed id
    if (product) {
        const updatedCart = await CartDAO.pushToProperty(cartId, product, 'products') // third parameter specifies the key to push changes to
        res.status(200).json(new CartDTO(updatedCart))
    } else {
        res.status(404).json({error: `Either cart ID: ${req.params.id} or product ID: ${req.params.product_id} does not exist.`})
    }
}

deleteProductFromCart = async (req, res) => {
    const cartId = req.params.id
    const productId = req.params.productId
    const success = await CartDAO.deleteFromPropertyById(cartId, productId)
    if (success) {
        return res.status(200).json({success: `Product ID: ${productId} has been deleted from cart ID: ${cartId}`})
    }
    // Executes when there are no matches since null is returned from the deleteFromPropertyById() method
    return res.status(404).json({error: `Either cart ID: ${cartId} does not exist or product ID: ${productId} was not in that cart.`})
}

purchaseCart = async (req, res) => {
    const username = req.params.username
    const name = req.session.user.name
    const id = req.params.id
    const cart = await CartDAO.getById(id)
    if (await verifyUsername(username) !== null && cart) {
        if (cart.username === username) {
            //using Twilio to send a WhatsApp message and an email upon purchase
            await twilioService.sendPurchaseWhatsapp(name, username)
            await twilioService.sendPurchaseEmail(name, username, cart)
            logger.info(`New purchase from ${username}. Cart: ${cart}`)
            res.status(202).json({success: `User ${username} has successfully purchased Cart ID: ${id}.`})
        } else {
            res.status(400).json({error: `Cart ID: ${id} does not belong to user ${username}.`})
        }
    } else if (cart.products.length === 0) {
        res.status(200).json({empty: `Cart ID: ${req.params.id} is empty.`})
    } else {
        res.status(404).json({error: `Either username ${username} or cart ID: ${id} does not exist.`})
    }
}

getCartsByUser = async (req, res) => {
    const username = req.params.username
    const carts = await CartDAO.getByUsername(username)
    if (!carts) {
        res.status(404).json({error: `No carts found for ${username}`})
    // } else if (carts.products.length === 0) {
    //     res.status(200).json({empty: `Cart ID: ${req.params.id} is empty.`})
    } else {
        res.status(200).json(carts)
    }
}

module.exports = {
    createCart,
    deleteCartById,
    getByCartId,
    addProductToCart,
    deleteProductFromCart,
    purchaseCart,
    getCartsByUser
}