//File-based data persistence class
const fs = require('fs')
const { logger } = require('../../logs')

class FileDAO {
    constructor(file) {
        this.file = file
    }

    // Useful for getting document count in order to assign order numbers
    getCount = async () => {
        const data = this.getParsedData()
        return data.length
    }

    getParsedData = async () => {
        let data = await fs.promises.readFile(this.file, 'utf-8')
        let parsedData
        try {
            parsedData = await JSON.parse(data)
        } catch (err) { // Executed when the file does not contain JSON-compatible information or is empty
            parsedData = []
        }
        return parsedData
    }

    save = async (object) => {
        try {
            let parsedData = this.getParsedData()
            // Executed if the file already has an array in it
            if (parsedData.length > 0) {
                object.id = parsedData[parsedData.length-1].id+1
                parsedData.push(object)
                await fs.promises.writeFile(this.file, JSON.stringify(parsedData, null, 2))
                return object
            }
            // Executed when the file contains some other JSON compatible data that's not an array (i.e.: an object)
            parsedData = []
            object.id = 1
            parsedData.push(object)
            await fs.promises.writeFile(this.file, JSON.stringify(parsedData, null, 2))
            return object
        } catch (err) {
            logger.error(err)
        }
    }

    updateItem = async (id, item) => { //saves all items when one of them has been edited
        try {
            let parsedData = this.getParsedData()
            const isValid = parsedData.findIndex(el => el.id == id)
            if (isValid != -1) {
                parsedData[isValid].dateString = new Date.toLocaleString()
                parsedData[isValid].name = item.name || parsedData[isValid].name
                parsedData[isValid].category = item.category || parsedData[isValid].category
                parsedData[isValid].description = item.description || parsedData[isValid].description
                parsedData[isValid].thumbnail = item.thumbnail || parsedData[isValid].thumbnail
                parsedData[isValid].price = item.price || parsedData[isValid].price
                parsedData[isValid].stock = item.stock || parsedData[isValid].stock
                await fs.promises.writeFile(this.file, JSON.stringify(parsedData, null, 2))
                return parsedData[isValid]
            }
            // Returns null when no match is found for the id param
            return null
        } catch (err) {
            logger.error(err)
        }
    }

    pushToProperty = async (id, item, property) => {
        try {
            let parsedData = this.getParsedData()
            const targetIndex = parsedData.findIndex(e => e.id == id)
            if (item && targetIndex !== -1) {
                parsedData[targetIndex][property].push(item)
                await fs.promises.writeFile(this.file, JSON.stringify(parsedData, null, 2))
                return parsedData[targetIndex]
            }
            // Null is returned if no item is passed or if the passed id does not match any items
            return null
        } catch (err) {
            logger.error(err)
        }
    }

    deleteFromPropertyById = async (cartId, productId) => {
        try {
            let parsedData = this.getParsedData()
            //executed when calling this method while using memory or file-based persistence, since assigned IDs are numeric
            if (!isNaN(cartId)) {
                const targetCartIndex = parsedData.findIndex(e => e.id == cartId)
                const targetProductIndex = parsedData[targetCartIndex].products.findIndex(e => e.id == productId)
                if (targetCartIndex != -1 && targetProductIndex != -1) {
                    parsedData[targetCartIndex].products.splice(targetProductIndex, 1)
                    await fs.promises.writeFile(this.file, JSON.stringify(parsedData, null, 2))
                    return parsedData[targetCartIndex].products
                }
            }
            // Returns null when an invalid ID format is passed or when there are no matches
            return null
        } catch (err) {
            logger.error(err)
        }
    }

    getById = async (id) => { //returns the object specified by the ID passed as an argument, or null if it does not exist
        try {
            let data = await fs.promises.readFile(this.file, "utf-8")
            let parsedData = await JSON.parse(data)
            if (parsedData.find(el => el.id == id)) {
                return parsedData.find(el => el.id == id)
            }
            else {
                return null
            }  
        } catch (err) {
            logger.error(err)
        }
    }

    getAll = async () => { //returns entire array in the file
        try {
            let data = await fs.promises.readFile(this.file, "utf-8")
            return JSON.parse(data)
        } catch (err) {
            logger.error(err)
            return false
        }
    }

    deleteById = async (id) => { //deletes array item (object) specified by ID
        try {
            let data = await fs.promises.readFile(this.file, "utf-8")
            let parsedData = await JSON.parse(data)
            if (parsedData.find(el => el.id == id)) {
                parsedData.splice(parsedData.indexOf(parsedData.find(el => el.id == id)), 1)
                await fs.promises.writeFile(this.file, JSON.stringify(parsedData, null, 2))
                logger.info("The item containing the specified ID has been deleted.")
                return true
                }
            else {
                logger.info("The specified ID does not match any items.")
                return false
            }
        } catch (err) {
            logger.error(err)
        }
    }

    deleteAll = async () => { //deletes all objects in the file and replaces them with an empty array
        try {
            await fs.promises.writeFile(this.file, JSON.stringify([]))
            logger.info("All items have been deleted.")
        } catch (err) {
            logger.error(err)
        }
    }
}

module.exports = FileDAO