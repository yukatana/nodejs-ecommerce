const { Router } = require('express')
const cartsRouter = Router()
const cartsController = require('../controllers/cartsController')
const authMiddleware = require('../middlewares/auth/checkAuthentication')

// POST new cart related to a username
cartsRouter.post('/:username', authMiddleware, cartsController.createCart)
// DELETE a cart by ID
cartsRouter.delete('/:id', authMiddleware, cartsController.deleteCartById)
// GET a cart's products by ID
cartsRouter.get('/:id/products', cartsController.getByCartId)
// POST a product to a cart
cartsRouter.post('/:id/products/:product_id', authMiddleware, cartsController.addProductToCart)
// DELETE a product from a cart
cartsRouter.delete('/:id/products/:product_id', authMiddleware, cartsController.deleteProductFromCart)

module.exports = cartsRouter