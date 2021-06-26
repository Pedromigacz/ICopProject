if (process.env.NODE_ENV !== "production") require("dotenv").config();

module.exports = {
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeEndpointSecretPR: process.env.STRIPE_ENDPOINT_SECRET_PR,
  stripeEndpointSecretSB: process.env.STRIPE_ENDPOINT_SECRET_SB,
};
