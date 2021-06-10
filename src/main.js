const express = require("express");
const app = express();
const middleware = require('./middlewares/middlewares.js')

app.use(middleware.helmet)

app.get("*", (req, res) => res.send("Welcome to the error page"));

module.exports = app;