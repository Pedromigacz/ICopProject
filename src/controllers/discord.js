const crypto = require("crypto");
const User = require("../models/User.js");
const ErrorResponse = require("../utils/errorResponse.js");
const { frontEndUrl } = require("../utils/dns.js");
const axios = require("axios");
const envs = require("../utils/discord.js");
const Querystring = require("querystring");
const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2();

// Discord bot socket connection
const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.login(envs.botToken);

client.on("ready", () => {
  console.log("Bot connected successfully");
});

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

    if (!(user.discord.id === data.id)) {
      const guild = await client.guilds.cache.get(envs.serverId);
      const user = await guild.members.fetch(data.id);
      await user.kick();
      // console.log(user.kick());
    }

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

exports.filterDiscord = async (req, res, next) => {
  const userList = await User.find({
    role: "user",
    paidUntil: { $lt: new Date() },
  });

  //console.log(userList);

  // const user = await client.users.fetch("293437376154566666");
  // const guild = await client.guilds.cache.get("768155259821883393");
  // const user = await guild.members.fetch("292827895783620608");
  // user.roles.remove("890719813612220417");
  // console.log(user.roles);

  res.status(200).json({
    success: true,
    data: "Discord server filtered successfully",
  });
};
