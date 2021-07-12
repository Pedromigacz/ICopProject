const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpire } = require("../utils/jwt.js");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: [true, "There should be only one user per email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide and valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minLength: 6,
    select: false,
  },
  stripeId: {
    type: String,
    required: [true, "Please provide a strapiId"],
    unique: [true, "There should be only one user per stipeId"],
  },
  activated: {
    type: Boolean,
    default: false,
  },
  paidUntil: {
    type: Date,
    required: false,
  },
  listOfTravels: [
    {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Travel",
    },
  ],
  role: {
    type: String,
    default: "user",
  },
  name: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// USER PRE HOOKS
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  if (!this._update.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this._update.password = await bcrypt.hash(this._update.password, salt);
  this._update.activated = true;
  next();
});

UserSchema.pre("remove", async function (next) {
  try {
    await this.listOfTravels.map(async (travel) => {
      const travelDoc = await mongoose.model("Travel").findById(travel._id);
      await travelDoc.remove();
    });
  } catch (error) {
    return next(error);
  }
  next();
});

// USER MOTHODS
UserSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, jwtSecret, { expiresIn: jwtExpire });
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds

  return resetToken;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
