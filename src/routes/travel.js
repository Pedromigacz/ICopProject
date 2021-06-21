const express = require("express");
const router = express.Router();

const {
  getTravel,
  postTravel,
  putTravel,
  deleteTravel,
} = require("../controllers/travel.js");

const {
  verifyAdminPrivilige,
  verifyAndFindUser,
  verifyOwnershipOrAdminPrivilege,
} = require("../middlewares/auth.js");

router
  .route("/:travelId")
  .get(verifyAndFindUser, verifyOwnershipOrAdminPrivilege, getTravel);

router.route("/").post(verifyAndFindUser, verifyAdminPrivilige, postTravel);

router
  .route("/:travelId")
  .put(verifyAndFindUser, verifyAdminPrivilige, putTravel);

router
  .route("/:travelId")
  .delete(verifyAndFindUser, verifyAdminPrivilige, deleteTravel);

module.exports = router;
