const express = require("express"),
  router = express.Router(),
  { verifyAndFindUser } = require("../middlewares/auth.js");

const { addDiscordAccount } = require("../controllers/discord.js");

// router
//   .route("/completeRegistration")
//   .post(verifyAndFindUser, completeRegistration);

router.route("/addDiscordAccount").post(verifyAndFindUser, addDiscordAccount);

module.exports = router;
