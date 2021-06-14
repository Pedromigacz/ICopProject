if (process.env.NODE_ENV !== "production") require("dotenv").config();

module.exports = {
  frontEndUrl: process.env.FRONT_END_URL || "http://localhost:3000",
};
