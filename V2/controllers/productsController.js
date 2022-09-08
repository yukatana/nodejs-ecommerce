const ProductsContainer = require('../DAOs').productsDAO //returns an instance of a DAO class which extends to the chosen container type

getProductById = async (req, res) => {
    if (req.params.id) {
        const product = await ProductsContainer.getById(req.params.id)
        if (!product) {
            res.status(404).json({error: 'Product not found'})
        } else {
            res.status(200).json(product)
        }
    } else {
        const data = await ProductsContainer.getAll()
        data.length !== 0 ? res.status(200).json(data) : res.status(200).json(data)
    }
}

addProduct =  async (req, res) => {
    const product = {
        timestamp: Date.now(),
        name: req.body.name,
        description: req.body.description,
        code: Math.floor(Math.random() * 1000),
        thumbnail: req.body.thumbnail,
        price: req.body.price,
        stock: req.body.stock
    }
    const newProduct = await ProductsContainer.save(product)
    res.status(201).json({newProduct})
}

updateProductById = async (req, res) => {
    const data = await ProductsContainer.getAll()
    const isValid = data.findIndex(el => el.id == req.params.id)

    if (isValid != -1) {
        data[isValid].timestamp = Date.now()
        data[isValid].name = req.body.name
        data[isValid].description = req.body.description
        data[isValid].thumbnail = req.body.thumbnail
        data[isValid].price = req.body.price
        data[isValid].stock = req.body.stock

        await ProductsContainer.updateItem(data, req.params.id, data[isValid])
        res.status(200).json({message: `Product ID: ${req.params.id} has been updated.`})
    } else {
        res.status(404).json({error: 'Product not found'})
    }
}

deleteProductById = async (req, res) => {
    const success = await ProductsContainer.deleteById(req.params.id)
    success ?
        res.status(200).json({message: `Product ID: ${req.params.id} has been deleted.`})
        : res.status(404).json({error: 'Product not found'})
}

module.exports = {
    getProductById,
    addProduct,
    updateProductById,
    deleteProductById
}