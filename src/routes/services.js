const express = require("express");
const router = express.Router();
const { getPrivateService } = require("../controllers/services.js");
const { protect } = require("../middlewares/auth.js");

router.route("/").get(protect, getPrivateService);

module.exports = router;
