// The factory returns an instance of a DAO class which extends to the chosen container type
const ProductDAO = require('../factories/DAOFactory').getProductDAO()
const { ProductDTO } = require('../DTOs')
const { logger } = require('../../logs')

getProductById = async (req, res) => {
    try {
        if (req.params.id) {
            let product = await ProductDAO.getById(req.params.id)
            if (!product) {
                return res.status(404).json({error: 'Product not found.'})
            }
            // toClient() method returns only name, thumbnail, price, and stock
            product = new ProductDTO(product).toClient()
            return res.status(200).json(product)
        } else {
            let data = await ProductDAO.getAll()
            // evaluates whether the query returned any data
            if (data.length !== 0) {
                data.map(product => {return new ProductDTO(product)})
                return res.status(200).json(data)
            }
            return res.status(404).json({error: 'No products were found on the database.'})
        }
    } catch (err) {
        logger.error(err)
    }
}

getByCategory = async (req, res) => {
    try {
        if (!req.params.category) {
            return res.status(400).json({error: `BAD REQUEST - please specify a category parameter.`})
        }
        const category = req.params.category
        let products = await ProductDAO.filter('category', category)
        if (!products) {
            return res.status(404).json({error: `No products match your filter for category ${category}.`})
        }
        // Mapping products to ProductDTO
        products.map(product => {return new ProductDTO(product)})
        return res.status(200).json(products)
    } catch (err) {
        logger.error(err)
    }
}

addProduct = async (req, res) => {
    const product = {
        dateString: new Date.toLocaleString(),
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        thumbnail: req.body.thumbnail,
        price: req.body.price,
        stock: req.body.stock
    }
    let newProduct = await ProductDAO.save(product)
    logger.info(`New product successfully added - ${newProduct}`)
    newProduct = new ProductDTO(newProduct)
    res.status(201).json({newProduct})
}

updateProductById = async (req, res) => {
    // Evaluates all data in order to be compatible with file and memory persistence DAOs
    const data = await ProductDAO.getAll()
    const isValid = data.findIndex(el => el.id == req.params.id)

    if (isValid != -1) {
        data[isValid].dateString = new Date.toLocaleString()
        data[isValid].name = req.body.name || data[isValid].name
        data[isValid].category = req.body.category || data[isValid].category
        data[isValid].description = req.body.description || data[isValid].description
        data[isValid].thumbnail = req.body.thumbnail || data[isValid].thumbnail
        data[isValid].price = req.body.price || data[isValid].price
        data[isValid].stock = req.body.stock || data[isValid].stock

        const result = await ProductDAO.updateItem(data, req.params.id, data[isValid])
        logger.info(`Product successfully updated - ${result}`)
        return res.status(200).json({message: `Product ID: ${req.params.id} has been updated.`})
    }
    return res.status(404).json({error: 'Product not found'})
}

deleteProductById = async (req, res) => {
    const success = await ProductDAO.deleteById(req.params.id)
    if (success) {logger.info(`Product ID: ${req.params.id} has been deleted successfully.`)}
    success ?
        res.status(200).json({message: `Product ID: ${req.params.id} has been deleted.`})
        : res.status(404).json({error: 'Product not found'})
}

module.exports = {
    getProductById,
    addProduct,
    updateProductById,
    deleteProductById,
    getByCategory
}