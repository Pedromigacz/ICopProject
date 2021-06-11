const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  passport = require("passport"),
  localStrategy = require("passport-local"),
  User = require("./models/user.js"),
  mongoData = require("./utils/databaseCredentials.js"),
  session = require("express-session"),
  MongoStore = require("connect-mongo"),
  { sessionSecret } = require("./utils/secrets");

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
        res.status(400).send({
          errorMessage: "Input data must be on JSON format!",
        });
      }
    },
  })
);

// Helmet Middleware
const { helmet } = require("./middlewares");
app.use(helmet());

// Auth middleware
app.use(
  session({
    secret: sessionSecret,
    store: MongoStore.create({
      mongoUrl: db["_connectionString"],
      ttl: 14 * 24 * 60 * 60,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, maxAge: 10000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.use("/auth", require("./routes/userAuth"));

// 404 Error handler
app.get("*", (req, res, next) => {
  res.status(404).send({
    errorMessage: "The page/data you are looking for doesn't exist!",
  });
});

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected successfully");
});

module.exports = app;
