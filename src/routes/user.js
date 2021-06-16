const express = require("express"),
  router = express.Router();

const {
  completeRegistration,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/user.js");

router.route("/completeRegistration").post(completeRegistration);

router.route("/login").post(login);

router.route("/forgotPassword").post(forgotPassword);

router.route("/resetPassword/:resetToken").post(resetPassword);

module.exports = router;
