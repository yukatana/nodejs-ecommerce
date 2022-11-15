const { Router } = require('express')
const cartsRouter = Router()
const authMiddleware = require('../middlewares/auth/checkAuthentication')
const {
    createCart,
    deleteCartById,
    getByCartId,
    addProductToCart,
    deleteProductFromCart
} = require("../controllers/cartsController")

// POST new cart
cartsRouter.post("/", authMiddleware, createCart)
// DELETE a cart by ID
cartsRouter.delete("/:id", authMiddleware, deleteCartById)
// GET a cart's products by ID
cartsRouter.get("/:id/products", getByCartId)
// POST a product to a cart
cartsRouter.post("/:id/products/:product_id", authMiddleware, addProductToCart)
// DELETE a product from a cart
cartsRouter.delete("/:id/products/:product_id", authMiddleware, deleteProductFromCart)

module.exports = cartsRouter