const express = require("express"),
  router = express.Router(),
  {
    verifyAndFindUser,
    verifyAdminPrivilige,
    verifySuperAdminPrivilige,
  } = require("../middlewares/auth.js");

const {
  completeRegistration,
  login,
  forgotPassword,
  resetPassword,
  removeUser,
  createSubscription,
  findUsers,
  createUser,
  getUser,
  updateUser,
  cancelSubscription,
  userUpdateItself,
  updateSubscription,
  addDiscordAccount,
} = require("../controllers/user.js");

router
  .route("/completeRegistration")
  .post(verifyAndFindUser, completeRegistration);

router.route("/login").post(login);

router.route("/forgotPassword").post(forgotPassword);

router.route("/resetPassword/:resetToken").post(resetPassword);

router
  .route("/user/:userId")
  .delete(verifyAndFindUser, verifySuperAdminPrivilige, removeUser);

router.route("/create-subscription").post(createSubscription);

router
  .route("/cancel-subscription")
  .post(verifyAndFindUser, cancelSubscription);

router
  .route("/findUser")
  .post(verifyAndFindUser, verifyAdminPrivilige, findUsers);

router.route("/:userId").get(verifyAndFindUser, verifyAdminPrivilige, getUser);

router
  .route("/admin/:userId")
  .put(verifyAndFindUser, verifySuperAdminPrivilige, updateUser);

router
  .route("/createUser")
  .post(verifyAndFindUser, verifySuperAdminPrivilige, createUser);

router.route("/updateUser").put(verifyAndFindUser, userUpdateItself);

router.route("/updateSubscription").put(verifyAndFindUser, updateSubscription);

module.exports = router;
