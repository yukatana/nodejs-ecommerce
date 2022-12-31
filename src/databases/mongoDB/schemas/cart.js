const { Schema, model } = require('mongoose')

const CartSchema = new Schema({
    username: {type: String, required: true},
    products: {type: Array, default: []},
    dateString: {type: String, default: `${new Date().toLocaleString()}`},
    deliveryAddress: {type: String, required: true}
}, {timestamps: true})

const Cart = model('carts', CartSchema)

module.exports = Cart