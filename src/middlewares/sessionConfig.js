const config = require('../config')
const MongoStore = require('connect-mongo')

const sessionConfig = {
    store: new MongoStore({
        mongoUrl: `mongodb+srv://${config.MONGODB_USERNAME}:${config.MONGODB_PASSWORD}@${config.MONGODB_URI}/${config.MONGODB_SESSIONS}`,
        ttl: 60 * 10
    }),
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}

module.exports = { sessionConfig }