if(process.env.NODE_ENV !== 'production') require('dotenv').config()

module.exports = {
    sessionSecret: process.env.SESSION_SECRET || 'Feeling good today (:(:(:',
}