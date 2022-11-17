const { Router } = require('express')
const productsRouter = Router()
const checkAuthentication = require('../middlewares/auth/checkAuthentication')
const {
    getProductById,
    addProduct,
    updateProductById,
    deleteProductById
} = require("../controllers/productsController")

// GET product by ID or all products if no ID is passed
productsRouter.get("/:id?", getProductById)
// POST a new product
productsRouter.post("/", checkAuthentication, addProduct)
// PUT an existing product by ID
productsRouter.put("/:id", checkAuthentication, updateProductById)
// DELETE a product by ID
productsRouter.delete("/:id", checkAuthentication, deleteProductById)

module.exports = productsRouter