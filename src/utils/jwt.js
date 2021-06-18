if (process.env.NODE_ENV !== "production") require("dotenv").config();

module.exports = {
  jwtSecret:
    process.env.JWT_SECRET ||
    "sdfsdgfifvjy2384uufd985y49725810u38du83ueu8ru3ur38u1ru13ur8u",
  jwtExpire: process.env.JWT_EXPIRE || "50min",
};
