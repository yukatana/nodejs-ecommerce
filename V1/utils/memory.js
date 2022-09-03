//Memory-based data handling class for testing purposes. Not for database interaction.

module.exports = class MemoryContainer {

    constructor(name) {
        this.name = name
        this.products = []
    }

    save = (object) => {
        if (this.products.length > 0) {
            object.id = this.products[this.products.length-1].id+1
            this.products.push(object)
        } else {
            object.id = 1
            this.products.push(object)  
        }
        return object
    }

    getById = async (id) => { //returns the object specified by the ID passed as an argument, or null if does not exist
        if (products.find(el => el.id == id)) {
            return products.find(el => el.id == id)
        }
        else {
            return null
        }
    }

    getAll = () => { //returns entire array in memory
        return this.products
    }

    deleteById = async (id) => { //deletes array item (object) specified by ID
        if (this.products.find(el => el.id == id)) {
            this.products.splice(this.products.indexOf(this.products.find(el => el.id == id)), 1)
            return console.log("The item containing the specified ID has been deleted.")
            }
        else {
            console.log("The specified ID does not match any items.")
            return null
        }
    }

    deleteAll = () => { //deletes all objects in the file and replaces them with an empty array
        this.products = []
        console.log("All items have been deleted.")
    }
}