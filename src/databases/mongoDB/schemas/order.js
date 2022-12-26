const { Schema, model } = require('mongoose')

const orderSchema = new Schema({
    products: {type: Array, required: true},
    deliveryAddress: {type: String, required: true},
    originCart: {type: String, required: true},
    orderNumber: {type: Number, required: true},
    state: {type: String, default: 'generated'},
    dateString: {type: String, default: `${new Date().toLocaleString()}`},
}, {timestamps: true})

const Order = model('orders', orderSchema)

module.exports = Order