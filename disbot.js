const pgs = require("./config/pgs.js");
const discord = require("discord.js");
require("dotenv").config("./.env");
const chalk = require("chalk");
console.clear();

const disbot = async () => {
  const tableNames = [
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

  const createTablesIfNotExist = async () => {
    try {
      for (const tableName of tableNames) {
        const query = `
CREATE TABLE IF NOT EXISTS ${tableName} (
id SERIAL PRIMARY KEY,
data JSONB
);
`;
        await pgs.DATABASE.query(query);
      }
    } catch (error) {
      console.error(chalk.bold.red("❌ Error creating tables:"), error);
    }
  };

  try {
    await pgs.DATABASE.authenticate();
    console.log(chalk.bold.green("✅ Connected to PostgreSQL!"));
    await createTablesIfNotExist();
  } catch (error) {
    console.error(chalk.bold.red("❌ Failed to connect to PostgreSQL:"), error);
    return;
  }

  const webhook = {};

  for (const tableName of tableNames) {
    webhook[tableName] = tableName;
  }

  const sendLog = async (tableName, logData) => {
    const query = {
      text: `INSERT INTO ${tableName} (data) VALUES ($1)`,
      values: [JSON.stringify(logData)],
    };

    try {
      await pgs.DATABASE.query(query.text, query.values);
    } catch (error) {
      console.error(
        chalk.bold.red(`❌ Error inserting log into ${tableName}:`),
        error
      );
    }
  };

  const startLogs = {
    tableName: webhook.startLogs,
  };

  const shardLogs = {
    tableName: webhook.shardLogs,
  };

  const consoleLogs = {
    tableName: webhook.consoleLogs,
  };

  const warnLogs = {
    tableName: webhook.warnLogs,
  };

  const manager = new discord.ShardingManager("./brain.js", {
    token: process.env.DISCORD_TOKEN,
    totalShards: "auto",
    respawn: true,
  });

  switch (process.env.TOPGG_TOKEN) {
    case true:
      const { AutoPoster } = require("topgg-autoposter");
      AutoPoster(process.env.TOPGG_TOKEN, manager);
      break;
    default:
      break;
  }

  console.log(
    chalk.bold.blue("System") +
      chalk.white(">>") +
      chalk.green("✨ Starting up") +
      chalk.white("...")
  );
  console.log(
    chalk.bold.blue("© MagneumDev | 2021 - " + new Date().getFullYear())
  );
  console.log(chalk.bold.blue("All rights reserved"));
  console.log("\u001b[0m");
  console.log("\u001b[0m");
  console.log(
    chalk.bold.blue("System") +
      chalk.white(">>") +
      chalk.red(
        "📦 Version " + require(`${process.cwd()}/package.json`).version
      ) +
      chalk.green(" loaded")
  );

  manager.on("shardCreate", async (shard) => {
    await sendLog(startLogs.tableName, {
      username: "Bot Logs",
      embeds: [
        {
          title: "🆙 Launching shard",
          description: "A shard has just been launched",
          fields: [
            {
              name: "🆔 ID",
              value: `${shard.id + 1}/${manager.totalShards}`,
              inline: true,
            },
            {
              name: "📃 State",
              value: "Starting up...",
              inline: true,
            },
          ],
          color: "#5865F2",
        },
      ],
    });

    console.log(
      chalk.bold.blue("System") +
        chalk.white(">>") +
        chalk.green("✨ Starting") +
        chalk.red(" Shard #" + (shard.id + 1)) +
        chalk.white("...")
    );

    shard.on("death", async (process) => {
      await sendLog(shardLogs.tableName, {
        username: "Bot Logs",
        embeds: [
          {
            title: `🚨 Closing shard ${shard.id + 1}/${
              manager.totalShards
            } unexpectedly`,
            fields: [
              {
                name: "🆔 ID",
                value: `${shard.id + 1}/${manager.totalShards}`,
              },
            ],
            color: "#5865F2",
          },
        ],
      });

      switch (process.exitCode === null) {
        case true:
          await sendLog(shardLogs.tableName, {
            username: "Bot Logs",
            embeds: [
              {
                title: `🚨 Shard ${shard.id + 1}/${
                  manager.totalShards
                } exited with NULL error code!`,
                fields: [
                  {
                    name: "PID",
                    value: "`" + process.pid + "`",
                  },
                  {
                    name: "Exit code",
                    value: "`" + process.exitCode + "`",
                  },
                ],
                color: "#5865F2",
              },
            ],
          });
          break;
        default:
          break;
      }
    });

    shard.on("shardDisconnect", async (event) => {
      await sendLog(shardLogs.tableName, {
        username: "Bot Logs",
        embeds: [
          {
            title: `🚨 Shard ${shard.id + 1}/${
              manager.totalShards
            } disconnected`,
            description: "Dumping socket close event...",
            color: "#5865F2",
          },
        ],
      });
    });

    shard.on("shardReconnecting", async () => {
      await sendLog(shardLogs.tableName, {
        username: "Bot Logs",
        embeds: [
          {
            title: `🚨 Reconnecting shard ${shard.id + 1}/${
              manager.totalShards
            }`,
            color: "#5865F2",
          },
        ],
      });
    });
  });

  manager.spawn();

  process.on("unhandledRejection", async (error) => {
    console.error(chalk.bold.red("Unhandled promise rejection:"), error);
    if (error && error.length > 950)
      error = error.slice(0, 950) + "... view console for details";
    if (error.stack && error.stack.length > 950)
      error.stack = error.stack.slice(0, 950) + "... view console for details";
    if (!error.stack) return;
    await sendLog(consoleLogs.tableName, {
      username: "Bot Logs",
      embeds: [
        {
          title: "🚨・Unhandled promise rejection",
          fields: [
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
          ],
        },
      ],
    });
  });

  process.on("warning", async (warn) => {
    console.warn(chalk.bold.yellow("Warning:"), warn);
    await sendLog(warnLogs.tableName, {
      username: "Bot Logs",
      embeds: [
        {
          title: "🚨・New warning found",
          fields: [
            {
              name: "Warn",
              value: "```" + warn + "```",
            },
          ],
        },
      ],
    });
  });
};

disbot().catch((error) => {
  console.error(chalk.bold.red("❌ An error occurred during startup:"), error);
});
