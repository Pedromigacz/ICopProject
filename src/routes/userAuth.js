const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../models/user");

// SIGN UP ENDPOINT
router.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password)
    .then(() => {
      res.json({ data: "some random data" });
    })
    .catch((err) => {
      if (err.name === "MissingPasswordError") {
        res.status(401).send({
          errorMessage: err.message,
        });
      }
      if (err.name === "MissingUsernameError") {
        res.status(401).send({
          errorMessage: err.message,
        });
      }
      if (err.name === "UserExistsError") {
        res.status(409).send({
          errorMessage: err.message,
        });
      }
    });
});

// SIGN IN ENDPOINT
// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/campgrounds',
//     failureRedirect: '/login'
//   }), (req, res) => {})

// // LOGOUT ENDPOINT
// router.get('/logout', (req, res) => {
//   req.logout()
//   res.redirect('/campgrounds')
// })

module.exports = router;
