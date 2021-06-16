const { stripeSecretKey, stripeEndpointSecret } = require("../utils/stripe.js");

const stripe = require("stripe")(stripeSecretKey);

exports.stripe = () => stripe;

exports.verifyStrapiSignature = (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  try {
    req.body = stripe.webhooks.constructEvent(
      req.body,
      sig,
      stripeEndpointSecret
    );
    next();
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
