const crypto = require("crypto");
const User = require("../models/User.js");
const ErrorResponse = require("../utils/errorResponse.js");
const { frontEndUrl } = require("../utils/dns.js");
const axios = require("axios");
const envs = require("../utils/discord.js");
const Querystring = require("querystring");

exports.addDiscordAccount = async (req, res, next) => {
  if (!req.query.code) {
    return next(new ErrorResponse("Missing code parameter", 400));
  }

  try {
    let body = Querystring.stringify({
      client_id: envs.client_id,
      client_secret: envs.client_secret,
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: envs.redirect_uri,
    });

    let config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    const res = await axios.post(
      "https://discord.com/api/oauth2/token",
      body,
      config
    );

    console.log(res.data);
  } catch (err) {
    return next(err);
  }

  res.status(200).json({
    success: true,
    data: "Discord account bound successfully",
  });
};
