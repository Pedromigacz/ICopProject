const express = require("express"),
  router = express.Router(),
  {
    verifyAndFindUser,
    verifySuperAdminPrivilige,
  } = require("../middlewares/auth.js");

const {
  addDiscordAccount,
  filterDiscord,
} = require("../controllers/discord.js");

// router
//   .route("/completeRegistration")
//   .post(verifyAndFindUser, completeRegistration);

router.route("/addDiscordAccount").post(verifyAndFindUser, addDiscordAccount);

router
  .route("/refreshServer")
  .get(verifyAndFindUser, verifySuperAdminPrivilige, filterDiscord);

module.exports = router;
