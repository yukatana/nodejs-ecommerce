//MongoDB-based data persistence class. Each instance is loaded using a different Schema with mongoose, hence making it reusable
const mongoose = require('mongoose')

class MongoDBcontainer {
    constructor(Schema) {
        this.Schema = Schema
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
            console.log(err)
        }
    }

    updateItem = async (data) => { //saves all items when one of them has been edited
        try {
            await fs.promises.writeFile(this.file, JSON.stringify(data, null, 2))
        } catch (err) {
            console.log(err)
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
            console.error(err)
        }
    }

    getAll = async () => { //returns entire array in the file
        try {
            let data = await fs.promises.readFile(this.file, "utf-8")
            return JSON.parse(data)
        } catch (err) {
            console.error(err)
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
                console.log("The item containing the specified ID has been deleted.")
                return true
            }
            else {
                console.log("The specified ID does not match any items.")
                return false
            }
        } catch (err) {
            console.error(err)
        }
    }

    deleteAll = async () => { //deletes all objects in the file and replaces them with an empty array
        try {
            await fs.promises.writeFile(this.file, JSON.stringify([]))
            console.log("All items have been deleted.")
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = MongoDBcontainer