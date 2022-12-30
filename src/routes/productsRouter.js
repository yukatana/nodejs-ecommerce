const { Router } = require('express')
const productsRouter = Router()
const { jwtValidation} = require('../middlewares/auth/passport')
const productsController = require('../controllers/productsController')

// GET product by ID, or all products if no param is specified
productsRouter.get('/:id?', productsController.getProductById)
// GET all products pertaining to a specific category
productsRouter.get('/category/:category', productsController.getByCategory)
// POST a new product
productsRouter.post('/', jwtValidation, productsController.addProduct)
// PUT an existing product by ID
productsRouter.put('/:id', jwtValidation, productsController.updateProductById)
// DELETE a product by ID
productsRouter.delete('/:id', jwtValidation, productsController.deleteProductById)

module.exports = productsRouter