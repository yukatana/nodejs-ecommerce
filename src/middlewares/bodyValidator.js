const { body } = require('express-validator')

class BodyValidator {
    static validatePostProductBody = () => {
        return [
            // Check for mandatory fields
            body('name').exists().withMessage('Your request must contain a "name" field'),
            body('category').exists().withMessage('Your request must contain a "category" field'),
            body('thumbnail').exists().isURL().withMessage('Your request must contain a "thumbnail" field'),
            body('price').exists().withMessage('Your request must contain a "price" field'),
            // Check for allowed fields so no wildcards are saved
            body().custom((body) => {
                const allowedKeys = ['name', 'category', 'description', 'thumbnail', 'price', 'stock']
                for (const key of Object.keys(body)) {
                    if (!allowedKeys.includes(key)) {
                        throw new Error(`Unknown property: ${key}`)
                    }
                }
                return true
            }).withMessage('Only name, category, description, thumbnail, price, and stock fields are allowed for product creation.')
        ]
    }

    static validatePutProductBody = () => {
        return [
            // Only check for allowed fields since updates can be partial
            body().custom((body) => {
                const allowedKeys = ['name', 'category', 'description', 'thumbnail', 'price', 'stock']
                for (const key of Object.keys(body)) {
                    if (!allowedKeys.includes(key)) {
                        throw new Error(`Unknown property: ${key}`)
                    }
                }
                return true
            }).withMessage('Only name, category, description, thumbnail, price, and stock fields are allowed for product updates.')
        ]
    }
}

module.exports = BodyValidator