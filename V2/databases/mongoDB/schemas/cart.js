const { Schema, model } = require('mongoose')


const CartSchema = new Schema({
    products: {type: Array, required: false},
}, {timestamps: true})

const Cart = model('carts', CartSchema)

module.exports = Cart
