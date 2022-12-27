const { Router } = require('express')
const productsRouter = Router()
const checkAuthentication = require('../middlewares/auth/checkAuthentication')
const { passportJWT } = require('../middlewares/auth/passport')
const productsController = require('../controllers/productsController')

// GET product by ID, or all products if no param is specified
productsRouter.get('/:id?', productsController.getProductById)
// GET all products pertaining to a specific category
productsRouter.get('/category/:category', productsController.getByCategory)
// POST a new product
productsRouter.post('/', passportJWT, /*checkAuthentication,*/ productsController.addProduct)
// PUT an existing product by ID
productsRouter.put('/:id', passportJWT, /*checkAuthentication,*/ productsController.updateProductById)
// DELETE a product by ID
productsRouter.delete('/:id', passportJWT, /*checkAuthentication,*/ productsController.deleteProductById)

module.exports = productsRouter