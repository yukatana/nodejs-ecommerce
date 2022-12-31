const User = require('../databases/mongoDB/schemas/user')

class UserService {
    // Verifies that a username actually exists in the database
    static verifyUsername = async (username) => {
        return User.findOne({username})
    }

    // Fetches delivery address from user databases for when carts are created
    static getDeliveryAddress = async (username) => {
        const deliveryAddress = await User.findOne({username}, 'address -_id')
        // Returning address property since an object is returned
        return deliveryAddress.address
    }

    // Pushes a newly created cart to the 'carts' property in the user object
    static pushCartToUser = async (username, cartId) => {
        const user = await User.findOne({username})
        user.carts.push(cartId)
        return user.save()
    }

    // Deletes a cart from a user's 'carts' property
    static removeCartFromUser = async (username, cartId) => {
        const user = await User.findOne({username})
        user.carts.pull(cartId)
        return user.save()
    }
}


module.exports = UserService