const express = require("express"),
  router = express.Router(),
  { verifyAndFindUser } = require("../middlewares/auth.js");

const {
  completeRegistration,
  login,
  forgotPassword,
  resetPassword,
  removeUser,
  createSubscription,
} = require("../controllers/user.js");

router
  .route("/completeRegistration")
  .post(verifyAndFindUser, completeRegistration);

router.route("/login").post(login);

router.route("/forgotPassword").post(forgotPassword);

router.route("/resetPassword/:resetToken").post(resetPassword);

router.route("/user/:userId").delete(verifyAndFindUser, removeUser);

router.route("/create-subscription").post(createSubscription);

module.exports = router;
