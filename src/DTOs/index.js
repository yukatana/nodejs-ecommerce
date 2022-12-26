class CartDTO {
    constructor(cart) {
        this.id = cart._id || cart.id // OR statement assigns _id when the object comes from MongoDB
        this.username = cart.username
        this.products = cart.products
    }
}

class ProductDTO {
    constructor(product) {
        this.id = product._id || product.id
        this.name = product.name
        this.description = product?.description
        this.code = product.code
        this.thumbnail = product.thumbnail
        this.price = product.price
        this.stock = product.stock
    }
}

class MessageDTO {
    constructor(message) {
        this.username = message.username
        this.type = message.type
        this.body = message.body
        this.dateString = message.dateString
    }
}

module.exports = { CartDTO, ProductDTO, MessageDTO }