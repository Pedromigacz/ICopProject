const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  mongoData = require("./utils/databaseCredentials.js"),
  helmet = require("helmet"),
  errorHandler = require("./middlewares/error.js");
const {
  jsonHeaderVerifier,
  jsonBodyVerifierAndParser,
} = require("./middlewares/checkReq.js");

// Connect to db
mongoose.connect(
  `mongodb+srv://${mongoData.name}:${mongoData.password}${mongoData.path}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);
const db = mongoose.connection;

// Webhooks routers
app.use("/api/webhooks", require("./webhooks/auth.js"));

// Middlewares
// JSON header virifier
app.use(jsonHeaderVerifier);

// Json req verifier and parser
app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      try {
        if (req.method === "GET") return;
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
app.use("/api/travels", require("./routes/travel.js"));
app.use("/api/services", require("./routes/service.js"));

// 404 Error handler
app.get("*", (req, res, next) => {
  res.sendStatus(404);
});

// General Error Handler
app.use(errorHandler);

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected successfully");
});

module.exports = app;
