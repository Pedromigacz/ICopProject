const express = require("express");
const router = express.Router();
const { getPrivateService } = require("../controllers/services.js");
const { verifyAndFindUser } = require("../middlewares/auth.js");

router.route("/").get(verifyAndFindUser, getPrivateService);

module.exports = router;
