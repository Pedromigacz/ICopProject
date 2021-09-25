const express = require("express"),
  router = express.Router(),
  { verifyAndFindUser } = require("../middlewares/auth.js");

const {
  addDiscordAccount,
  filterDiscord,
} = require("../controllers/discord.js");

// router
//   .route("/completeRegistration")
//   .post(verifyAndFindUser, completeRegistration);

router.route("/addDiscordAccount").post(verifyAndFindUser, addDiscordAccount);

router.route("/refreshServer").get(filterDiscord);

module.exports = router;
