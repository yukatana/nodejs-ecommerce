const { logger } = require('../../logs')
//returns an instance of a DAO class which extends to the chosen container type
const CartDAO = require('../factories/DAOFactory').getCartDAO()
//necessary since some methods need to access the products database
const ProductDAO = require('../factories/DAOFactory').getProductDAO()
// Order DAO necessary to save incoming orders to databases
const OrderDAO = require('../factories/DAOFactory').getOrderDAO()
const { CartDTO, ProductDTO, OrderDTO } = require('../DTOs')
const UserService = require('../services/userService')
const twilioService = require('../services/twilio')

createCart = async (req, res) => {
    const username = req.params.username
    // Verifies whether the username is in the users MongoDB collection
    if (await UserService.verifyUsername(username) === null) {
        return res.status(400).json({error: `Bad request - can't create a cart for an invalid username.`})
    }
    const newCart = await CartDAO.save({
        username,
        products: [],
        dateString: new Date().toLocaleString(),
        deliveryAddress: await UserService.getDeliveryAddress(username)
    })
    // pushCartToUser method pushes the newly created cart's ID to the user object's 'carts' property
    await UserService.pushCartToUser(username, newCart._id)
    return res.status(201).json(new CartDTO(newCart))
}

deleteCartById = async (req, res) => {
    const cartId = req.params.id
    const cart = await CartDAO.getById(cartId)
    const cartOwner = cart.username
    // Removing the cart's ID reference from the cart's owner user object
    await UserService.removeCartFromUser(cartOwner, cartId)
    const success = await CartDAO.deleteById(cartId)
    success ?
        res.status(200).json({success: `Cart ID: ${cartId} has been deleted.`})
        : res.status(404).json({error: 'Cart not found'})
}

getCartById = async (req, res) => {
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
    // Quantity of the product to be added to a cart is passed as 'qty' query, or defaults to 1 if not passed
    const qty = req.query.qty || 1
    const product = await ProductDAO.getById(productId)
    if (!product) {
        return res.status(404).json({error: `Either cart ID: ${cartId} or product ID: ${productId} does not exist.`})
    }
    // Executes only when a corresponding product has been found for the passed id
    const productWithQty = {...product, qty}
    const updatedCart = await CartDAO.pushToProperty(cartId, productWithQty, 'products') // third parameter specifies the key to push changes to
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
    const cartOwnerUsername = req.params.username
    const clientUsername = req.user.username // WAITING FOR ANSWER REGARDING AUTHORIZATION PERSISTENCE
    const id = req.params.id
    const cart = await CartDAO.getById(id)
    if (await UserService.verifyUsername(cartOwnerUsername) !== null && cart) {
        // Verifying that the specified cart belongs to the username passed in the URL
        if (cart.username === cartOwnerUsername) {
            //using Twilio to send a WhatsApp message and an email upon purchase
            await twilioService.sendPurchaseWhatsapp(clientUsername, cartOwnerUsername)
            await twilioService.sendPurchaseEmail(clientUsername, cartOwnerUsername, cart)
            logger.info(`New purchase from ${cartOwnerUsername}. Cart: ${cart}`)
            const order = {
                username: cartOwnerUsername,
                items: cart.products,
                orderNumber: OrderDAO.getCount()+1, // Order numbers are increasingly assigned based on how many documents there are in the order collection
                dateString: new Date().toLocaleString(),
                state: 'generated'
            }
            const newOrder = OrderDAO.save(order)
            return res.status(202).json(new OrderDTO(newOrder))
        }
        // Error sent when trying to purchase a cart that belongs to another user
        return res.status(400).json({error: `Cart ID: ${id} does not belong to user ${cartOwnerUsername}.`})
    } else if (cart.products.length === 0) {
        res.status(200).json({error: `Cart ID: ${id} is empty.`})
    } else {
        res.status(404).json({error: `Either username ${cartOwnerUsername} or cart ID: ${id} does not exist.`})
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
    getCartById,
    addProductToCart,
    deleteProductFromCart,
    purchaseCart,
    getCartsByUser
}