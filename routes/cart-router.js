const { Router } = require("express")
const fs = require ("fs")

const Container = require("../utils/container")
const file = "cart.json"
const cartContainer = new Container(file)

const cartRouter = new Router()
const authMiddleware = require('../utils/auth-middleware')


module.exports = cartRouter