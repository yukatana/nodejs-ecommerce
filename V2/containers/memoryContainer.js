//Memory-based data handling class for ephemeral data.

module.exports = class MemoryContainer {

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

    getById = async (id) => { //returns the object specified by the ID passed as an argument, or null if it does not exist
        if (this.data.find(el => el.id == id)) {
            return this.data.find(el => el.id == id)
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
            console.log("The item containing the specified ID has been deleted.")
            return true
            }
        else {
            console.log("The specified ID does not match any items.")
            return null
        }
    }

    deleteAll = () => { //deletes all objects in the file and replaces them with an empty array
        this.data = []
        console.log("All items have been deleted.")
    }
}