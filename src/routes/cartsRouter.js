const { Router } = require('express')
const cartsRouter = Router()
const cartsController = require('../controllers/cartsController')
const { jwtValidation } = require('../middlewares/auth/passport')


// GET all carts related to a user
cartsRouter.get('/:username', jwtValidation, cartsController.getCartsByUser)
// POST new cart related to a username
cartsRouter.post('/:username', jwtValidation, cartsController.createCart)
// POST a purchase request of the products in one of a user's carts
cartsRouter.post('/:username/:id', jwtValidation, cartsController.purchaseCart)
// DELETE a cart by ID
cartsRouter.delete('/:id', jwtValidation, cartsController.deleteCartById)
// GET a cart's products by ID
cartsRouter.get('/:id/products', cartsController.getCartById)
// POST a product to a cart
cartsRouter.post('/:id/products/:productId', jwtValidation, cartsController.addProductToCart)
// DELETE a product from a cart
cartsRouter.delete('/:id/products/:productId', jwtValidation, cartsController.deleteProductFromCart)

module.exports = cartsRouter