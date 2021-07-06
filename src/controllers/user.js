const crypto = require("crypto");
const User = require("../models/User.js");
const ErrorResponse = require("../utils/errorResponse.js");
const { frontEndUrl } = require("../utils/dns.js");
const sendEmail = require("../utils/sendEmail.js");

const { stripeSecretKey } = require("../utils/stripe.js");
const stripe = require("stripe")(stripeSecretKey);

exports.completeRegistration = async (req, res, next) => {
  // req validation
  if (!req.body.password) {
    return next(new ErrorResponse("missing new password", 400));
  }

  let newAtt = { password: req.body.password };

  if (req.body.name) {
    newAtt.name = req.body.name;
  }

  try {
    const user = await User.findByIdAndUpdate(req.user._id, newAtt);

    res.status(200).json({ success: true, data: "use updated successfully" });
  } catch (error) {
    next(error);
  }
};

// NORMAL USER ROUTES
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 400));
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 404));
    }

    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 404));
    }

    // verify if user is admin
    if (user.role !== "user") {
      return sendToken(user, 200, res, "admin");
    }

    // verify if user is active
    if (user.activated !== false) {
      return sendToken(user, 200, res, "default");
    }

    return sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("Sorry, email could not be sent.", 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = frontEndUrl + `/passwordReset/${resetToken}`;

    const message = `
    <h1>You have requested a password reset</h1>
    <p>Please go to this link to reset your password</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({
        success: true,
        data: "Password change email sent successfully",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse("Email could not be send", 500));
    }
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  if (!req.params.resetToken || !req.body.password) {
    return next(new ErrorResponse("Missing params", 400));
  }

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid or Expired Reset Token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: "Password Reset Success",
    });
  } catch (error) {
    next(error);
  }
};

exports.removeUser = async (req, res, next) => {
  if (!req.params.userId) {
    return next(new ErrorResponse("missing userId", 400));
  }

  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return next(new ErrorResponse("user not found", 404));
    }

    await user.remove();
  } catch (error) {
    return next(error);
  }
  res.status(200).json({
    success: true,
    data: "user deleted successfully",
  });
};

exports.createSubscription = async (req, res, next) => {
  if (!req.body.email) {
    return next(new ErrorResponse("Missing email parameter", 400));
  }

  const email = req.body.email;

  try {
    // Create customer
    const customer = await stripe.customers.create({
      email: req.body.email,
    });

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: "price_1JAIFGJaJuHCA5Fm0nDxAnyV",
        },
      ],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    return next(error);
  }
};

exports.findUsers = async (req, res, next) => {
  if (!req.body.email) {
    return next(new ErrorResponse("Missing email parameter", 400));
  }

  try {
    const users = await User.find({
      email: { $regex: new RegExp(req.body.email), $options: "i" },
    });

    res.status(200).json({ success: true, users: users });
  } catch (error) {
    return next(error);
  }
};

const sendToken = (user, statusCode, res, status = "first login") => {
  const token = user.getSignedToken();
  res.status(statusCode).json({
    success: true,
    token,
    status,
  });
};
