const express = require("express"),
  router = express.Router(),
  User = require("../models/User.js");

const {
  verifyStrapiSignaturePR,
  verifyStrapiSignatureSB,
} = require("../middlewares/stripe.js");
const ErrorResponse = require("../utils/errorResponse.js");
const { stripeSecretKey } = require("../utils/stripe.js");
const stripe = require("stripe")(stripeSecretKey);
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail.js");
const { frontEndUrl } = require("../utils/dns.js");

// subscription created event
router
  .route("/preRegistration")
  .post(
    express.raw({ type: "*/*" }),
    verifyStrapiSignaturePR,
    async (req, res, next) => {
      const event = req.body;

      // check event
      if (event.type !== "customer.subscription.updated") {
        return next(new ErrorResponse("Webhook denied", 400));
      }
      // check if it turned the plan active
      if (event.data.object.plan.active === false) {
        return res
          .status(200)
          .json({ success: true, data: "no alteration was made" });
      }

      // generate random 8 char password
      const priorPassword = generatePassword();

      try {
        // retrieve customer data from Stripe api
        const customer = await stripe.customers.retrieve(
          event.data.object.customer
        );

        // create user
        let user;
        try {
          user = await User.create({
            email: customer.email,
            password: priorPassword,
            stripeId: event.data.object.customer,
            paidUtil: Date.now() + 33 * 24 * 60 * 60 * 1000, // expiration date 33 days after the payment, so the user has at least one extra day
          });
        } catch (error) {
          // In case the user is already created
          return next(error);
        }

        // send credentials by email
        sendEmail({
          to: user.email,
          subject: "Get access to your account at COMPANY NAME",
          text: `
          <h1>Here are your credentials to access our site</h1>
          <p>email: ${user.email} (your Stripe email)</p>
          <p>password: <strong>${priorPassword}</strong></p>
          <p>This password will grants access to your first login and should be changed</p>
          <p>You can login at <a href=${frontEndUrl} clicktracking=off>our login page</a></p>
          `,
        });
      } catch (error) {
        return next(error);
      }

      res
        .status(200)
        .json({ success: true, data: "user created successfully" });
    }
  );

// subscription renewal event
router
  .route("/subscription")
  .post(
    express.raw({ type: "*/*" }),
    verifyStrapiSignatureSB,
    async (req, res, next) => {
      const event = req.body;

      if (event.type !== "invoice.payment_succeeded") {
        return next(new ErrorResponse("Webhook denied", 400));
      }

      try {
        await User.findOneAndUpdate(
          {
            stripeId: event.data.object.customer,
          },
          {
            paidUtil: Date.now() + 33 * 24 * 60 * 60 * 1000, // expiration date 33 days after the payment, so the user has at least one extra day
          }
        );
      } catch (error) {
        return next(error);
      }

      res
        .status(200)
        .json({ success: true, data: "subscription updated successfully" });
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
