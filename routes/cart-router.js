const { Router } = require("express")
const fs = require ("fs")

const Container = require("../utils/container")

const productContainer = new Container('database.json')
const cartContainer = new Container('cart.json')

const cartRouter = new Router()
const authMiddleware = require('../utils/auth-middleware')

cartRouter.post("/", authMiddleware, async (req, res) => {
    const newCart = await cartContainer.save({
        timestamp: Date.now(),
        products: []
    })
    res.status(201).json({message: `A new cart has been created with ID: ${newCart.id}.`})
})

cartRouter.delete("/:id", authMiddleware, async (req, res) => {
    const success = await cartContainer.deleteById(req.params.id)
    success ?
    res.status(200).json({message: `Cart ID: ${req.params.id} has been deleted.`})
    : res.status(400).json({error: "Cart not found"})
})

cartRouter.get("/:id/products", async (req, res) => {
    const cart = await cartContainer.getById(req.params.id)
    if (!cart) {
        res.status(400).json({error: "Cart not found"})
    } else {
        res.status(200).json(cart)
    }
})

cartRouter.post("/:id/products/:product_id", authMiddleware, async (req, res) => {
    const allCarts = cartContainer.getAll()
    const product = productContainer.getById(req.params.product_id)
    const targetCartIndex = allCarts.findIndex(e => e.id == req.params.id)

    if (product && targetCartIndex != -1) {
        const updatedCarts = allCarts[targetCartIndex].products.push(product)
        cartContainer.saveCarts(updatedCarts)
        res.status(200).json({message: `Product ID: ${req.params.product_id} has been added to cart ID: ${req.params.id}`})
    } else {
        res.status(404).json({error: `Either cart ID: ${req.params.id} or product ID: ${req.params.product_id} does not exist.`})
    }
})

cartRouter.delete("/:id/products/:product_id", authMiddleware, async (req, res) => {
    const allCarts = cartContainer.getAll()
    const targetCartIndex = allCarts.findIndex(e => e.id == req.params.id)
    const targetProductIndex = allCarts[targetCartIndex].products.findIndex(e => e.id == req.params.product_id)

    if (targetCartIndex != -1) {
        const updatedCarts = allCarts[targetCartIndex].products.splice(targetProductIndex, 1)
        cartContainer.saveCarts(updatedCarts)
        res.status(200).json({message: `Product ID: ${req.params.product_id} has been deleted from cart ID: ${req.params.id}`})
    } else {
        res.status(404).json({error: `Either cart ID: ${req.params.id} or product ID: ${req.params.product_id} does not exist.`})
    }
})

module.exports = cartRouter