if (process.env.NODE_ENV !== "production") require("dotenv").config();

module.exports = {
  client_id: process.env.DISCORD_CLIENT_ID || "xxx",
  client_secret: process.env.DISCORD_CLIENT_SECRET || "xxx",
  redirect_uri:
    process.env.DISCORD_REDIRECT_URI || "http://localhost:3000/discordConfig",
  guild_id: process.env.DISCORD_GUILD_ID || "768155259821883393",
  bot_token: process.env.DISCORD_BOT_TOKEN || "",
  roles_list: process.env.DISCORD_ROLES_LIST || "887155810130608159",
};
