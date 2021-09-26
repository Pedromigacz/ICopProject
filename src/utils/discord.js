if (process.env.NODE_ENV !== "production") require("dotenv").config();

module.exports = {
  client_id: process.env.DISCORD_CLIENT_ID || "xxx",
  client_secret: process.env.DISCORD_CLIENT_SECRET || "xxx",
  redirect_uri:
    process.env.DISCORD_REDIRECT_URI || "http://localhost:3000/discordConfig",
  guild_id: process.env.DISCORD_GUILD_ID || "768155259821883393",
  bot_token: process.env.DISCORD_BOT_TOKEN || "",
  roles_list: process.env.DISCORD_ROLES_LIST || "887155810130608159",
  botToken:
    process.env.DISCORD_BOT_TOKEN ||
    "ODg2Mzk5NzExMjE1NDkzMTUw.YT1CDw.LK9KuMdqOitoDw57ryo3MpQoxQg",
  serverId: process.env.DISCORD_SERVER_ID || "768155259821883393",
  customerRoleId: process.env.DISCORD_CUSTOMER_ROLE_ID || "887155810130608159",
  suspendedCustomerRoleId:
    process.env.DISCORD_SUSPENDED_CUSTOMER_ROLE_ID || "890719813612220417",
  cronSchedule: process.env.DISCORD_CRON_SCHEDULE || "0 3 * * *",
};
