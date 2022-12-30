class CartDTO {
    constructor(cart) {
        // OR operator differentiates between _id from MongoDB and id from other persistence mechanisms
        this._id = cart._id || cart.id
        this.username = cart.username
        this.products = cart.products
        this.deliveryAddress = cart.deliveryAddress
        this.dateString = cart.dateString
    }
}

class ProductDTO {
    constructor(product) {
        this._id = product._id || product.id
        this.name = product.name
        this.category = product.category
        this.description = product?.description
        this.thumbnail = product.thumbnail
        this.price = product.price
        this.stock = product.stock
        this.dateString = product.dateString
    }
}

class MessageDTO {
    constructor(message) {
        // No _id is assigned since messages are part of the websocket channel and not the REST API itself
        this.username = message.username
        this.type = message.type
        this.body = message.body
        this.dateString = message.dateString
    }
}

class OrderDTO {
    constructor(order) {
        this._id = order._id || order.id
        this.products = order.products
        this.deliveryAddress = order.deliveryAddress
        this.originCart = order.originCart
        this.orderNumber = order.orderNumber
        this.state = order.state
        this.dateString = order.dateString
    }
}

class UserDTO {
    constructor(user) {
        this.firstName = user.firstName
        this.lastName = user.lastName
        this.username = user.username
        this.address = user.address
        this.phone = user.phone
    }
}

module.exports = { CartDTO, ProductDTO, MessageDTO, OrderDTO, UserDTO }