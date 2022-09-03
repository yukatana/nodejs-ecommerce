const { Router } = require('express')
const cartsRouter = Router()
const authMiddleware = require('../utils/authMiddleware')
const {
    createCart,
    deleteCartById,
    getByCartId,
    addProductToCart,
    deleteProductFromCart
} = require("../controllers/cartsController")

// Create new cart
cartsRouter.post("/", authMiddleware, createCart)
// Delete a cart by ID
cartsRouter.delete("/:id", authMiddleware, deleteCartById)
// Get a cart's products by ID
cartsRouter.get("/:id/products", getByCartId)
// Add a product to a cart
cartsRouter.post("/:id/products/:product_id", authMiddleware, addProductToCart)
// Delete a product from a cart
cartsRouter.delete("/:id/products/:product_id", authMiddleware, deleteProductFromCart)

module.exports = cartsRouter