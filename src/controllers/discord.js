const crypto = require("crypto");
const User = require("../models/User.js");
const ErrorResponse = require("../utils/errorResponse.js");
const { frontEndUrl } = require("../utils/dns.js");
const axios = require("axios");
const envs = require("../utils/discord.js");
const Querystring = require("querystring");
const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2();

exports.addDiscordAccount = async (req, res, next) => {
  if (!req.body.code) {
    return next(new ErrorResponse("Missing code parameter", 400));
  }

  try {
    let body = Querystring.stringify({
      client_id: envs.client_id,
      client_secret: envs.client_secret,
      grant_type: "authorization_code",
      code: req.body.code,
      redirect_uri: envs.redirect_uri,
    });

    let config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    let { data } = await axios.post(
      "https://discord.com/api/oauth2/token",
      body,
      config
    );

    const discordUser = await oauth.getUser(data.access_token);

    data.id = discordUser.id;
    data.username = discordUser.username;

    const user = await User.findById(req.user._id);

    user.discord = { ...data };

    try {
      oauth.addMember({
        accessToken: user.discord.access_token,
        botToken: envs.bot_token,
        guildId: envs.guild_id,
        userId: user.discord.id,
        roles: [...envs.roles_list.split(",")],
        nickname: user.email,
      });
    } catch (err) {
      // fallback, send a mesage with an invitation
      console.log(err);
    }

    await user.save();
  } catch (err) {
    console.log(err);
    return next(err);
  }

  res.status(200).json({
    success: true,
    data: "Discord account bound successfully",
  });
};
