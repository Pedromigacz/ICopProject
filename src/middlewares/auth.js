const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const ErrorResponse = require("../utils/errorResponse.js");
const { jwtSecret } = require("../utils/jwt.js");
const Travel = require("../models/Travel.js");

exports.verifyAndFindUser = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("access denied", 403));
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse("No user found with this id", 404));
    }

    if (
      user.paidUtil < Date.now() &&
      user.role !== "admin" &&
      user.role !== "superadmin"
    ) {
      return next(new ErrorResponse("please, complete your registration", 403));
    }

    req.user = user;

    next();
  } catch (error) {
    return next(new ErrorResponse("access denied", 403));
  }
};

exports.verifyAdminPrivilige = async (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "superadmin") {
    return next();
  }
  next(new ErrorResponse("access denied", 403));
};

exports.verifyOwnershipOrAdminPrivilege = async (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "superadmin") {
    return next();
  }
  try {
    const travel = await Travel.findById(req.params.travelId);

    if (travel.owner.equals(req.user._id)) {
      next();
    }
  } catch (error) {
    next(error);
  }

  next(new ErrorResponse("Access denied", 403));
};

exports.verifySuperAdminPrivilige = async (req, res, next) => {
  if (req.user.role === "superadmin") {
    return next();
  }
  next(new ErrorResponse("access denied", 403));
};
