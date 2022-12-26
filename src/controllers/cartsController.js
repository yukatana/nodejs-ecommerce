const { logger } = require('../../logs')
const CartDAO = require('../factories').getCartDAO() //returns an instance of a DAO class which extends to the chosen container type
const ProductDAO = require('../factories').getProductDAO() //necessary since some methods need to access the products database
const verifyUsername = require('../utils/verifyUsername')
const twilioService = require('../services/twilio')

createCart = async (req, res) => {
    if (await verifyUsername(req.params.username) === null) {
        return res.status(400).json({error: `Bad request - can't create a cart for an invalid username.`})
    }
    const newCart = await CartDAO.save({
        username: req.params.username,
        timestamp: Date.now(),
        products: []
    })
    res.status(201).json({success: `A new cart has been created with ID: ${newCart.id}.`})
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
        res.status(200).json(cart.products)
    }
}

addProductToCart = async (req, res) => {
    const allCarts = await CartDAO.getAll()
    const product = await ProductDAO.getById(req.params.product_id)
    const targetCartIndex = allCarts.findIndex(e => e.id == req.params.id)

    if (product && targetCartIndex != -1) { //executed only on file and memory persistence methods
        if (!isNaN(req.params.id) ||
            !isNaN(req.params.product_id)) {
                allCarts[targetCartIndex].products.push(product)
        }
        //allCarts has to be passed for memory and file persistence methods, but is used by neither mongoDB nor Firebase
        await CartDAO.updateItem(allCarts, req.params.id, product)
        res.status(200).json({success: `Product ID: ${req.params.product_id} has been added to cart ID: ${req.params.id}`})
    } else {
        res.status(404).json({error: `Either cart ID: ${req.params.id} or product ID: ${req.params.product_id} does not exist.`})
    }
}

deleteProductFromCart = async (req, res) => {
    //executed when calling this method while using memory or file-based persistence, since assigned IDs are numeric
    if (!isNaN(req.params.id)) {
        const allCarts = await CartDAO.getAll()
        const targetCartIndex = allCarts.findIndex(e => e.id == req.params.id)
        const targetProductIndex = allCarts[targetCartIndex].products.findIndex(e => e.id == req.params.product_id)
        if (targetCartIndex != -1 && targetProductIndex != -1) {
            allCarts[targetCartIndex].products.splice(targetProductIndex, 1)
            await CartDAO.updateItem(allCarts)
            return res.status(200).json({success: `Product ID: ${req.params.product_id} has been deleted from cart ID: ${req.params.id}`})
        } else {
            res.status(404).json({error: `Either cart ID: ${req.params.id} does not exist or product ID: ${req.params.product_id} was not in that cart.`})
        }
    } else {
        const success = await CartDAO.deleteFromCartById(req.params.id, req.params.product_id)
        if (success) {
            return res.status(200).json({success: `Product ID: ${req.params.product_id} has been deleted from cart ID: ${req.params.id}`})
        } else {
            res.status(404).json({error: `Either cart ID: ${req.params.id} does not exist or product ID: ${req.params.product_id} was not in that cart.`})
        }
    }
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