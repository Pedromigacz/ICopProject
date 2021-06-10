const express = require("express");
const app = express();
const helmet = require('helmet')

app.use(helmet())

app.get("*", (req, res) => res.send("Welcome to the error page"));

module.exports = app;