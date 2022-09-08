const { Router } = require('express')
const productsRouter = Router()
const authMiddleware = require('../utils/authMiddleware')
const {
    getProductById,
    addProduct,
    updateProductById,
    deleteProductById
} = require("../controllers/productsController")

// GET product by ID or all products if no ID is passed
productsRouter.get("/:id?", getProductById)
// POST a new product
productsRouter.post("/", authMiddleware, addProduct)
// PUT an existing product by ID
productsRouter.put("/:id", authMiddleware, updateProductById)
// DELETE a product by ID
productsRouter.delete("/:id", authMiddleware, deleteProductById)

module.exports = productsRouter