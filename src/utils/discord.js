if (process.env.NODE_ENV !== "production") require("dotenv").config();

module.exports = {
  client_id: process.env.DISCORD_CLIENT_ID || "xxx",
  client_secret: process.env.DISCORD_CLIENT_SECRET || "xxx",
  redirect_uri:
    process.env.DISCORD_REDIRECT_URI ||
    "http://localhost:1337/api/discord/addDiscordAccount/",
};
