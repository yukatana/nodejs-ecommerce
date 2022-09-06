const CartsContainer = require('../DAOs').cartsDAO //returns an instance of a DAO class which extends to the chosen container type
const ProductsContainer = require('../DAOs').productsDAO //necessary since some methods need to access the products database

createCart = async (req, res) => {
    const newCart = await CartsContainer.save({
        timestamp: Date.now(),
        products: []
    })
    res.status(201).json({message: `A new cart has been created with ID: ${newCart.id}.`})
}

deleteCartById = async (req, res) => {
    const success = await CartsContainer.deleteById(req.params.id)
    success ?
        res.status(200).json({message: `Cart ID: ${req.params.id} has been deleted.`})
        : res.status(400).json({error: 'Cart not found'})
}

getByCartId = async (req, res) => {
    const cart = await CartsContainer.getById(req.params.id)
    if (!cart) {
        res.status(400).json({error: 'Cart not found'})
    } else if (cart.products.length === 0) {
        res.status(400).json({error: `Cart ID: ${req.params.id} is empty.`})
    } else {
        res.status(200).json(cart.products)
    }
}

addProductToCart = async (req, res) => {
    const allCarts = await CartsContainer.getAll()
    const product = await ProductsContainer.getById(req.params.product_id)
    const targetCartIndex = allCarts.findIndex(e => e.id == req.params.id)

    if (product && targetCartIndex != -1) {
        allCarts[targetCartIndex].products.push(product)
        //allCarts has to be passed for memory and file persistence methods, but is used by neither mongoDB nor Firebase
        await CartsContainer.updateItem(allCarts, req.params.id, product)
        res.status(200).json({message: `Product ID: ${req.params.product_id} has been added to cart ID: ${req.params.id}`})
    } else {
        res.status(404).json({error: `Either cart ID: ${req.params.id} or product ID: ${req.params.product_id} does not exist.`})
    }
}

deleteProductFromCart = async (req, res) => {
    //executed when calling this method while using memory or file-based persistence, since assigned IDs are numeric
    if (!isNaN(req.params.id)) {
        const allCarts = await CartsContainer.getAll()
        const targetCartIndex = allCarts.findIndex(e => e.id == req.params.id)
        const targetProductIndex = allCarts[targetCartIndex].products.findIndex(e => e.id == req.params.product_id)
        if (targetCartIndex != -1 && targetProductIndex != -1) {
            allCarts[targetCartIndex].products.splice(targetProductIndex, 1)
            await CartsContainer.updateItem(allCarts)
            return res.status(200).json({message: `Product ID: ${req.params.product_id} has been deleted from cart ID: ${req.params.id}`})
        } else {
            res.status(404).json({error: `Either cart ID: ${req.params.id} does not exist or product ID: ${req.params.product_id} was not in that cart.`})
        }
    } else {
        const success = await CartsContainer.deleteFromCartById(req.params.id, req.params.product_id)
        if (success) {
            return res.status(200).json({message: `Product ID: ${req.params.product_id} has been deleted from cart ID: ${req.params.id}`})
        } else {
            res.status(404).json({error: `Either cart ID: ${req.params.id} does not exist or product ID: ${req.params.product_id} was not in that cart.`})
        }
    }

}

module.exports = {
    createCart,
    deleteCartById,
    getByCartId,
    addProductToCart,
    deleteProductFromCart
}