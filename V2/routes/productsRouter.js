const { Router } = require('express')
const productsRouter = Router()
const authMiddleware = require('../utils/authMiddleware')
const {
    getProductById,
    addProduct,
    updateProductById,
    deleteProductById
} = require("../controllers/productsController")

productsRouter.get("/:id?", getProductById)

productsRouter.post("/", authMiddleware, addProduct)

productsRouter.put("/:id", authMiddleware, updateProductById)

productsRouter.delete("/:id", authMiddleware, deleteProductById)

module.exports = productsRouter