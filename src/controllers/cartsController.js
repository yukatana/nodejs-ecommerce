const { logger } = require('../../logs')
//returns an instance of a DAO class which extends to the chosen container type
const CartDAO = require('../factories/DAOFactory').getCartDAO()
//necessary since some methods need to access the products database
const ProductDAO = require('../factories/DAOFactory').getProductDAO()
// Order DAO necessary to save incoming orders to databases
const OrderDAO = require('../factories/DAOFactory').getOrderDAO()
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
    const id = req.params.id
    const success = await CartDAO.deleteById(id)
    success ?
        res.status(200).json({success: `Cart ID: ${id} has been deleted.`})
        : res.status(404).json({error: 'Cart not found'})
}

getByCartId = async (req, res) => {
    const id = req.params.id
    const cart = await CartDAO.getById(id)
    if (!cart) {
        res.status(404).json({error: 'Cart not found'})
    } else if (cart.products.length === 0) {
        res.status(200).json({empty: `Cart ID: ${id} is empty.`})
    } else {
        res.status(200).json(cart.products.map(product => { return new ProductDTO(product) }))
    }
}

addProductToCart = async (req, res) => {
    const cartId = req.params.id
    const productId = req.params.productId
    const product = await ProductDAO.getById(productId)
    if (!product) {
        return res.status(404).json({error: `Either cart ID: ${req.params.id} or product ID: ${req.params.product_id} does not exist.`})
    }
    // Executes only when a corresponding product has been found for the passed id
    const updatedCart = await CartDAO.pushToProperty(cartId, product, 'products') // third parameter specifies the key to push changes to
    return res.status(200).json(new CartDTO(updatedCart))
}

deleteProductFromCart = async (req, res) => {
    const cartId = req.params.id
    const productId = req.params.productId
    // Second parameter as object in deleteFromPropertyById() allows for dynamic deletion
    const result = await CartDAO.deleteFromPropertyById(cartId, {name: 'products', id: productId})
    if (!result) {
        // Executes when there are no matches since null is returned from the deleteFromPropertyById() method
        return res.status(404).json({error: `Either cart ID: ${cartId} does not exist or product ID: ${productId} was not in that cart.`})
    }
    return res.status(200).json(new CartDTO(result))
}

purchaseCart = async (req, res) => {
    const username = req.params.username
    const name = req.session.user.name // WAITING FOR ANSWER REGARDING AUTHORIZATION PERSISTENCE
    const id = req.params.id
    const cart = await CartDAO.getById(id)
    if (await userService.verifyUsername(username) !== null && cart) {
        if (cart.username === username) {
            //using Twilio to send a WhatsApp message and an email upon purchase
            await twilioService.sendPurchaseWhatsapp(name, username)
            await twilioService.sendPurchaseEmail(name, username, cart)
            logger.info(`New purchase from ${username}. Cart: ${cart}`)
            const order = {
                username,
                items: cart.products,
                orderNumber: OrderDAO.getCount(),
                dateString: new Date.toLocaleString(),
                state: 'generated'
            }
            const newOrder = OrderDAO.save(order)
            return res.status(202).json(new OrderDTO(newOrder))
        }
        // Error sent when trying to purchase a cart that belongs to another user
        return res.status(400).json({error: `Cart ID: ${id} does not belong to user ${username}.`})
    } else if (cart.products.length === 0) {
        res.status(200).json({empty: `Cart ID: ${req.params.id} is empty.`})
    } else {
        res.status(404).json({error: `Either username ${username} or cart ID: ${id} does not exist.`})
    }
}

getCartsByUser = async (req, res) => {
    const username = req.params.username
    const carts = await CartDAO.filter(username)
    if (!carts) {
        return res.status(404).json({error: `No carts found for ${username}.`})
    }
    return res.status(200).json(carts)
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