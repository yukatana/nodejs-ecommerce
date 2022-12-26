const { Router } = require('express')
const productsRouter = Router()
const checkAuthentication = require('../middlewares/auth/checkAuthentication')
const { passportJWT } = require('../middlewares/auth/passport')
const {
    getProductById,
    addProduct,
    updateProductById,
    deleteProductById
} = require('../controllers/productsController')

// GET product by ID or all products if no ID is passed
productsRouter.get('/:id?', getProductById)
// GET all products pertaining to a specific category
// productsRouter.get('/:category')
// POST a new product
productsRouter.post('/', passportJWT, checkAuthentication, addProduct)
// PUT an existing product by ID
productsRouter.put('/:id', passportJWT, checkAuthentication, updateProductById)
// DELETE a product by ID
productsRouter.delete('/:id', passportJWT, checkAuthentication, deleteProductById)

module.exports = productsRouter