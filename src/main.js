const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  mongoData = require("./utils/databaseCredentials.js"),
  helmet = require("helmet");

// Connect to db
mongoose.connect(
  `mongodb+srv://${mongoData.name}:${mongoData.password}${mongoData.path}`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;

// Middlewares
// JSON header virifier
app.use((req, res, next) => {
  if (req.accepts("json")) return next();
  res.status(400).send({
    errorMessage: "pelse, include the right JSON header on your request!",
  });
});

// Json req verifier and parser
app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        res
          .status(400)
          .send({ errorMessage: "Input data must be on JSON format!" });
      }
    },
  })
);

// Helmet Middleware
app.use(helmet());

// Routes
app.use("/api/auth", require("./routes/user.js"));

// 404 Error handler
app.get("*", (req, res, next) => {
  res.sendStatus(404);
});

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected successfully");
});

module.exports = app;
