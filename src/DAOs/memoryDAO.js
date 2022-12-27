//Memory-based data handling class for ephemeral data.
const { logger } = require('../../logs')

class MemoryDAO {

    constructor() {
        this.data = []
    }

    save = (object) => {
        if (this.data.length > 0) {
            object.id = this.data[this.data.length-1].id+1
            this.data.push(object)
        } else {
            object.id = 1
            this.data.push(object)
        }
        return object
    }

    updateItem = async (id, item) => { //saves all items when one of them has been edited
        try {
            const isValid = this.data.findIndex(el => el.id == id)
            if (isValid != -1) {
                this.data[isValid].dateString = new Date.toLocaleString()
                this.data[isValid].name = item.name || this.data[isValid].name
                this.data[isValid].category = item.category || this.data[isValid].category
                this.data[isValid].description = item.description || this.data[isValid].description
                this.data[isValid].thumbnail = item.thumbnail || this.data[isValid].thumbnail
                this.data[isValid].price = item.price || this.data[isValid].price
                this.data[isValid].stock = item.stock || this.data[isValid].stock
                return this.data
            }
            // Returns null when no match is found for the id param
            return null
        } catch (err) {
            logger.error(err)
        }
    }

    getById = async (id) => { //returns the object specified by the ID passed as an argument, or null if it does not exist
        const item = await this.data.find(el => el.id == id)
        if (item) {
            return item
        }
        else {
            return null
        }
    }

    getAll = () => { //returns entire array in memory
        return this.data
    }

    deleteById = async (id) => { //deletes array item (object) specified by ID
        if (this.data.find(el => el.id == id)) {
            this.data.splice(this.data.indexOf(this.data.find(el => el.id == id)), 1)
            logger.info("The item containing the specified ID has been deleted.")
            return true
            }
        else {
            logger.info("The specified ID does not match any items.")
            return null
        }
    }

    deleteAll = () => { //deletes all objects in the file and replaces them with an empty array
        this.data = []
        logger.info("All items have been deleted.")
    }
}

module.exports = MemoryDAO