//Setting up Winston to log all incoming requests to the console, and warnings and errors to log files
const winston = require('winston')

const logger = winston.createLogger({
        level: 'info',
        transports: [
            new winston.transports.Console({level: 'info'}),
            new winston.transports.File({filename: 'logs/warn.log', level: 'warn'}),
            new winston.transports.File({filename: 'logs/error.log', level: 'error'})
        ]
    }
)

const infoLogger = (req, res, next) => {
    logger.info(`${req.method} request received for route ${req.path}`)
    next()
}

const warningLogger = (req, res, next) => {
    logger.warn(`Bad ${req.method} request received for non-existing route ${req.originalUrl}`)
    next()
}

module.exports = {
    logger,
    infoLogger,
    warningLogger
}