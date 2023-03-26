const { Router } = require('express')
const productsRouter = Router()
const { jwtValidation} = require('../middlewares/auth/passport')
// bodyValidator middleware class makes sure incoming requests have a valid body
const bodyValidator = require('../middlewares/bodyValidator')
const productsController = require('../controllers/productsController')
// allowing CORS on GET products
const cors = require('cors')

// GET product by ID, or all products if no param is specified
productsRouter.get('/:id?', cors(), productsController.getProductById)
// GET all products pertaining to a specific category
productsRouter.get('/category/:category', productsController.getByCategory)
// POST a new product
productsRouter.post('/', jwtValidation, bodyValidator.validatePostProductBody(), productsController.addProduct)
// PUT an existing product by ID
productsRouter.put('/:id', jwtValidation, bodyValidator.validatePutProductBody(), productsController.updateProductById)
// DELETE a product by ID
productsRouter.delete('/:id', jwtValidation, productsController.deleteProductById)

module.exports = productsRouter