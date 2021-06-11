if(process.env.NODE_ENV !== 'production') require('dotenv').config()

module.exports = {
    name: process.env.MONGO_NAME || 'teste',
    password: process.env.MONGO_PASSWORD || 'FBFo98VqFzgrfurD',
    path: process.env.MONGO_PATH || '@testcluster.xfr4v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
}