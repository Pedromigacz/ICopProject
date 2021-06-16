const express = require("express"),
  router = express.Router(),
  User = require("../models/User.js");

const { verifyStrapiSignature } = require("../middlewares/stripe.js");
const ErrorResponse = require("../utils/errorResponse.js");
const { stripeSecretKey } = require("../utils/stripe.js");
const stripe = require("stripe")(stripeSecretKey);
const crypto = require("crypto");

router
  .route("/preRegistration")
  .post(
    express.raw({ type: "*/*" }),
    verifyStrapiSignature,
    async (req, res, next) => {
      const event = req.body;

      // check event
      if (event.type !== "customer.subscription.updated") {
        return next(new ErrorResponse("Webhook denied", 400));
      }

      // generate random 8 char password
      const priorPassword = generatePassword();

      try {
        // retrieve customer data from Stripe api
        const customer = await stripe.customers.retrieve(
          event.data.object.customer
        );

        // create user
        const user = await User.create({
          email: customer.email,
          password: priorPassword,
          stripeId: event.data.object.customer,
        });
      } catch (error) {
        next(error);
      }

      res
        .status(200)
        .json({ success: true, data: "user created successfully" });
    }
  );

module.exports = router;

const generatePassword = (
  length = 8,
  wishlist = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$"
) =>
  Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join("");
