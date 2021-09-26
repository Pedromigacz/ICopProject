const cron = require("node-cron");
const envs = require("../utils/discord.js");
const { filterDiscord } = require("../controllers/discord.js");

exports.discordCronJobs = (req, res, next) => {
  cron.schedule(envs.cronSchedule, () => {
    filterDiscord(req, res, next);
    console.log("running scan");
  });
};
