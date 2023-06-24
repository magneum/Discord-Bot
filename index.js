const webhook = require("./database/json/webhooks.json");
const config = require("./config/bot.js");
const discord = require("discord.js");
require("dotenv").config("./.env");
const chalk = require("chalk");

const webHooksArray = [
  "startLogs",
  "shardLogs",
  "errorLogs",
  "dmLogs",
  "voiceLogs",
  "serverLogs",
  "serverLogs2",
  "commandLogs",
  "consoleLogs",
  "warnLogs",
  "voiceErrorLogs",
  "creditLogs",
  "evalLogs",
  "interactionLogs",
];

if (process.env.WEBHOOK_ID && process.env.WEBHOOK_TOKEN) {
  for (const webHook of webHooksArray) {
    switch (webHook) {
      case "startLogs":
      case "shardLogs":
      case "errorLogs":
      case "dmLogs":
      case "voiceLogs":
      case "serverLogs":
      case "serverLogs2":
      case "commandLogs":
      case "consoleLogs":
      case "warnLogs":
      case "voiceErrorLogs":
      case "creditLogs":
      case "evalLogs":
      case "interactionLogs":
        webhook[webHook].id = process.env.WEBHOOK_ID;
        webhook[webHook].token = process.env.WEBHOOK_TOKEN;
        break;
      default:
        break;
    }
  }
}

const startLogs = new discord.WebhookClient({
  token: webhook.startLogs.token,
  id: webhook.startLogs.id,
});

const shardLogs = new discord.WebhookClient({
  token: webhook.shardLogs.token,
  id: webhook.shardLogs.id,
});

const manager = new discord.ShardingManager("./brain.js", {
  token: process.env.DISCORD_TOKEN,
  totalShards: "auto",
  respawn: true,
});

if (process.env.TOPGG_TOKEN) {
  const { AutoPoster } = require("topgg-autoposter");
  AutoPoster(process.env.TOPGG_TOKEN, manager);
}

console.clear();
console.log(
  chalk.blue(chalk.bold("System")),
  chalk.white(">>"),
  chalk.green("Starting up"),
  chalk.white("...")
);
console.log("\u001b[0m");
console.log(chalk.red("© MagneumDev | 2021 - " + new Date().getFullYear()));
console.log(chalk.red("All rights reserved"));
console.log("\u001b[0m");
console.log("\u001b[0m");
console.log(
  chalk.blue(chalk.bold("System")),
  chalk.white(">>"),
  chalk.red("Version " + require(`${process.cwd()}/package.json`).version),
  chalk.green("loaded")
);
console.log("\u001b[0m");

manager.on("shardCreate", async (shard) => {
  await startLogs.send({
    username: "Bot Logs",
    embeds: [
      new discord.EmbedBuilder()
        .setTitle("🆙・Launching shard")
        .setDescription("A shard has just been launched")
        .setFields([
          {
            name: "🆔┆ID",
            value: `${shard.id + 1}/${manager.totalShards}`,
            inline: true,
          },
          {
            name: "📃┆State",
            value: "Starting up...",
            inline: true,
          },
        ])
        .setColor(config.colors.normal),
    ],
  });

  console.log(
    chalk.blue(chalk.bold("System")),
    chalk.white(">>"),
    chalk.green("Starting"),
    chalk.red("Shard #" + (shard.id + 1)),
    chalk.white("...")
  );
  console.log("\u001b[0m");

  shard.on("death", async (process) => {
    await shardLogs.send({
      username: "Bot Logs",
      embeds: [
        new discord.EmbedBuilder()
          .setTitle(
            "🚨・Closing shard " +
              (shard.id + 1) +
              "/" +
              manager.totalShards +
              " unexpectedly"
          )
          .setFields([
            {
              name: "🆔┆ID",
              value: `${shard.id + 1}/${manager.totalShards}`,
            },
          ])
          .setColor(config.colors.normal),
      ],
    });

    if (process.exitCode === null) {
      await shardLogs.send({
        username: "Bot Logs",
        embeds: [
          new discord.EmbedBuilder()
            .setTitle(
              "🚨・Shard " +
                (shard.id + 1) +
                "/" +
                manager.totalShards +
                " exited with NULL error code!"
            )
            .setFields([
              {
                name: "PID",
                value: "`" + process.pid + "`",
              },
              {
                name: "Exit code",
                value: "`" + process.exitCode + "`",
              },
            ])
            .setColor(config.colors.normal),
        ],
      });
    }
  });

  shard.on("shardDisconnect", async (event) => {
    await shardLogs.send({
      username: "Bot Logs",
      embeds: [
        new discord.EmbedBuilder()
          .setTitle(
            "🚨・Shard " +
              (shard.id + 1) +
              "/" +
              manager.totalShards +
              " disconnected"
          )
          .setDescription("Dumping socket close event...")
          .setColor(config.colors.normal),
      ],
    });
  });

  shard.on("shardReconnecting", async () => {
    await shardLogs.send({
      username: "Bot Logs",
      embeds: [
        new discord.EmbedBuilder()
          .setTitle(
            "🚨・Reconnecting shard " +
              (shard.id + 1) +
              "/" +
              manager.totalShards
          )
          .setColor(config.colors.normal),
      ],
    });
  });
});

manager.spawn();

const consoleLogs = new discord.WebhookClient({
  id: webhook.consoleLogs.id,
  token: webhook.consoleLogs.token,
});

const warnLogs = new discord.WebhookClient({
  id: webhook.warnLogs.id,
  token: webhook.warnLogs.token,
});

process.on("unhandledRejection", async (error) => {
  console.error("Unhandled promise rejection:", error);
  if (error && error.length > 950)
    error = error.slice(0, 950) + "... view console for details";
  if (error.stack && error.stack.length > 950)
    error.stack = error.stack.slice(0, 950) + "... view console for details";
  if (!error.stack) return;
  await consoleLogs
    .send({
      username: "Bot Logs",
      embeds: [
        new discord.EmbedBuilder()
          .setTitle("🚨・Unhandled promise rejection")
          .addFields([
            {
              name: "Error",
              value: error ? discord.codeBlock(error) : "No error",
            },
            {
              name: "Stack error",
              value: error.stack
                ? discord.codeBlock(error.stack)
                : "No stack error",
            },
          ]),
      ],
    })
    .catch(() => {
      console.log("Error sending unhandled promise rejection to webhook");
      console.log(error);
    });
});

process.on("warning", async (warn) => {
  console.warn("Warning:", warn);
  await warnLogs
    .send({
      username: "Bot Logs",
      embeds: [
        new discord.EmbedBuilder().setTitle("🚨・New warning found").addFields([
          {
            name: "Warn",
            value: "```" + warn + "```",
          },
        ]),
      ],
    })
    .catch(() => {
      console.log("Error sending warning to webhook");
      console.log(warn);
    });
});
