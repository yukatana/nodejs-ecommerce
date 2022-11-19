const { Router } = require('express')
const cartsRouter = Router()
const cartsController = require('../controllers/cartsController')
const checkAuthentication = require('../middlewares/auth/checkAuthentication')
const { sendRegisteredUserEmail } = require('../services/twilio')

// GET all carts related to a user
cartsRouter.get('/:username', checkAuthentication, cartsController.getCartsByUser)
// POST new cart related to a username
cartsRouter.post('/:username', checkAuthentication, cartsController.createCart)
// POST a purchase request of the products in one of a user's carts
cartsRouter.post('/:username/:id', checkAuthentication, sendRegisteredUserEmail, cartsController.purchaseCart)
// DELETE a cart by ID
cartsRouter.delete('/:id', checkAuthentication, cartsController.deleteCartById)
// GET a cart's products by ID
cartsRouter.get('/:id/products', cartsController.getByCartId)
// POST a product to a cart
cartsRouter.post('/:id/products/:product_id', checkAuthentication, cartsController.addProductToCart)
// DELETE a product from a cart
cartsRouter.delete('/:id/products/:product_id', checkAuthentication, cartsController.deleteProductFromCart)

module.exports = cartsRouter