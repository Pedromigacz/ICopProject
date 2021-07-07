const express = require("express");
const router = express.Router();

const {
  getPrivateService,
  postService,
  putScervice,
  deleteService,
  findServices,
} = require("../controllers/services.js");

const {
  verifyAndFindUser,
  verifyAdminPrivilige,
} = require("../middlewares/auth.js");

router.route("/:serviceId").get(verifyAndFindUser, getPrivateService);

router.route("/").post(verifyAndFindUser, verifyAdminPrivilige, postService);

router
  .route("/:serviceId")
  .put(verifyAndFindUser, verifyAdminPrivilige, putScervice);

router
  .route("/:serviceId")
  .delete(verifyAndFindUser, verifyAdminPrivilige, deleteService);

router
  .route("/getServices")
  .post(verifyAndFindUser, verifyAdminPrivilige, findServices);

module.exports = router;
