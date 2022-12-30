const { Router } = require('express')
const productsRouter = Router()
const { jwtValidation} = require('../middlewares/auth/passport')
// BodyValidator middleware class makes sure incoming requests have a valid body
const BodyValidator = require('../middlewares/bodyValidator')
const productsController = require('../controllers/productsController')

// GET product by ID, or all products if no param is specified
productsRouter.get('/:id?', productsController.getProductById)
// GET all products pertaining to a specific category
productsRouter.get('/category/:category', productsController.getByCategory)
// POST a new product
productsRouter.post('/', jwtValidation, BodyValidator.validatePostProductBody, productsController.addProduct)
// PUT an existing product by ID
productsRouter.put('/:id', jwtValidation, BodyValidator.validatePutProductBody, productsController.updateProductById)
// DELETE a product by ID
productsRouter.delete('/:id', jwtValidation, productsController.deleteProductById)

module.exports = productsRouter