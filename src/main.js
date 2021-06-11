const express = require("express"),
      app = express(),
      mongoose = require('mongoose'),
      mongoData = require('./utils/databaseCredentials.js')

// Connect to db
mongoose.connect(`mongodb+srv://${mongoData.name}:${mongoData.password}${mongoData.path}`, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;

// Middlewares
const {
    helmet
} = require('./middlewares')

app.use(helmet())


// 404 Error handler
app.get('*', (req, res, next) => {
    res.sendStatus(404)
})

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {console.log('Database Connected successfully')})

module.exports = app;