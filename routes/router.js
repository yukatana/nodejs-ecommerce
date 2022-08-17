const { Router } = require("express")
const fs = require ("fs")

const Container = require("../utils/container")
const file = "database.json"
const container = new Container(file)

const APIrouter = new Router()
const authMiddleware = require('../utils/auth-middleware')

APIrouter.get("/:id?", async (req, res) => {
    if (req.params.id) {
        const product = await container.getById(req.params.id)
        if (!product) {
            res.status(400).json({error: "Product not found"})
        } else {
            res.json(product)
        }
    } else {
        const data = await container.getAll()
        res.json(data)
    }
})

APIrouter.post("/", authMiddleware, async (req, res) => {
    res.json(await container.save({
        timestamp: Date.now(),
        name: req.body.name,
        description: req.body.description,
        code: "",
        thumbnail: req.body.thumbnail,
        price: req.body.price,
        stock: req.params.stock
    }))
})

APIrouter.put("/:id", authMiddleware, async (req, res) => {
    const data = await container.getAll()
    const isValid = data.findIndex(el => el.id == req.params.id)

    if (isValid != -1) {
        data[isValid].timestamp = Date.now()
        data[isValid].name = req.body.name
        data[isValid].description = req.body.description
        data[isValid].thumbnail = req.body.thumbnail
        data[isValid].price = req.body.price
        data[isValid].stock = req.body.stock
       
        await fs.promises.writeFile(file, JSON.stringify(data, null, 2))
        res.status(200).json({message: `Product ID: ${req.params.id} has been updated.`})
    } else {
        res.status(400).json({error: "Product not found"})
    }
})

APIrouter.delete("/:id", authMiddleware, async (req, res) => {
    const success = await container.deleteById(req.params.id)
    success ?
    res.status(200).json({message: `Product ID: ${req.params.id} has been deleted.`})
    : res.status(400).json({error: "Product not found"})
})

module.exports = APIrouter