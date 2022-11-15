// Database credentials loaded in .env
require('dotenv').config()

// Set up port from CLI command on startup
const args = require('yargs')(process.argv.slice(2))
    .alias({
        p: 'port',
        m: 'mode'
    })
    .default({
        port: 8080,
        mode: 'fork'
    })
    .argv

const MONGODB_USERNAME = process.env.MONGODB_USERNAME
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD
const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DATABASE = process.env.MONGODB_DATABASE
const MONGODB_SESSIONS = process.env.MONGODB_SESSIONS
const SESSION_SECRET = process.env.SESSION_SECRET
const PORT = args.port
const MODE = args.mode

module.exports = {
    MONGODB_USERNAME,
    MONGODB_PASSWORD,
    MONGODB_URI,
    MONGODB_DATABASE,
    MONGODB_SESSIONS,
    SESSION_SECRET,
    PORT,
    MODE
}