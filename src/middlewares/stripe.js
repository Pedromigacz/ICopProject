const {
  stripeSecretKey,
  stripeEndpointSecretPR,
  stripeEndpointSecretSB,
} = require("../utils/stripe.js");

const stripe = require("stripe")(stripeSecretKey);

exports.stripe = () => stripe;

exports.verifyStrapiSignaturePR = (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  try {
    req.body = stripe.webhooks.constructEvent(
      req.body,
      sig,
      stripeEndpointSecretPR
    );
    next();
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

exports.verifyStrapiSignatureSB = (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  try {
    req.body = stripe.webhooks.constructEvent(
      req.body,
      sig,
      stripeEndpointSecretSB
    );
    next();
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
