//File-based data persistence class
const fs = require('fs')
const { logger } = require('../../logs')

class FileDAO {
    constructor(file) {
        this.file = file
    }

    save = async (object) => {
        try {
            let data = await fs.promises.readFile(this.file, "utf-8")
            let parsedData

            try {
                parsedData = await JSON.parse(data)
            } catch (err) { //executed when the file does not contain JSON-compatible information or is empty
                parsedData = []
            }

            if (parsedData.length > 0) { //executed if the file already has an array in it
                object.id = parsedData[parsedData.length-1].id+1
                parsedData.push(object)
                await fs.promises.writeFile(this.file, JSON.stringify(parsedData, null, 2))
                return object
            }
            else { //executed when the file contains some other JSON compatible data that's not an array (i.e.: an object)
                parsedData = []
                object.id = 1
                parsedData.push(object)
                await fs.promises.writeFile(this.file, JSON.stringify(parsedData, null, 2))
                return object
            }
        } catch (err) {
            logger.error(err)
        }
    }

    updateItem = async (id, item) => { //saves all items when one of them has been edited
        try {
            let data = await fs.promises.readFile(this.file, "utf-8")
            let parsedData
            try {
                parsedData = await JSON.parse(data)
            } catch (err) { //executed when the file does not contain JSON-compatible information or is empty
                parsedData = []
            }
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