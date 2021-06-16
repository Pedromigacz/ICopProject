if (process.env.NODE_ENV !== "production") require("dotenv").config();

module.exports = {
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeEndpointSecret: process.env.STRIPE_ENDPOINT_SECRET,
};
