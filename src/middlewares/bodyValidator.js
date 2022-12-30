const { body, validationResult } = require('express-validator')

class BodyValidator {
    // Class-wide method checks whether there have been any validation errors
    static validateResults = (req, res, next) => {
        // Validate results and serve 400 if there are any errors
        const errors = validationResult(req)
        if (!errors.isEmpty()) { return res.status(400).json({errors: errors.array()}) }
        // Return next() is all required fields are OK
        return next()
    }

    static validatePostProductBody = (req, res, next) => {
        // Check for mandatory fields
        body('name').exists()
        body('category').exists()
        body('thumbnail').exists().isURL()
        body('price').exists()
        // Check for allowed fields so no wildcards are saved
        body().custom((body) => {
            const allowedKeys = ['name', 'category', 'description', 'thumbnail', 'price', 'stock']
            for (const key of Object.keys(body)) {
                if (!allowedKeys.includes(key)) {
                    throw new Error(`Unknown property: ${key}`)
                }
            }
            return true
        })
        return this.validateResults(req, res, next)
    }

    static validatePutProductBody = (req, res, next) => {
        // Only check for allowed fields since updates can be partial
        body().custom((body) => {
            const allowedKeys = ['name', 'category', 'description', 'thumbnail', 'price', 'stock']
            for (const key of Object.keys(body)) {
                if (!allowedKeys.includes(key)) {
                    throw new Error(`Unknown property: ${key}`)
                }
            }
            return true
        })
        return this.validateResults(req, res, next)
    }
}

module.exports = BodyValidator