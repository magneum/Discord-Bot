const discord = require("discord.js");
const { REST } = require("discord.js");
const { Routes } = require("discord.js");
const chalk = require("chalk");
const fs = require("fs");

module.exports = (client) => {
  const interactionLogs = new discord.WebhookClient({
    id: client.webhooks.interactionLogs.id,
    token: client.webhooks.interactionLogs.token,
  });

  const commands = [];

  if (client.shard.ids[0] === 0)
    console.log(
      chalk.blue(chalk.bold(`System`)),
      chalk.white(`>>`),
      chalk.green(`Loading commands`),
      chalk.white(`...`)
    );
  if (client.shard.ids[0] === 0) console.log(`\u001b[0m`);

  fs.readdirSync("./interactions").forEach((dirs) => {
    const commandFiles = fs
      .readdirSync(`./interactions/${dirs}`)
      .filter((files) => files.endsWith(".js"));

    if (client.shard.ids[0] === 0)
      console.log(
        chalk.blue(chalk.bold(`System`)),
        chalk.white(`>>`),
        chalk.red(`${commandFiles.length}`),
        chalk.green(`commands of`),
        chalk.red(`${dirs}`),
        chalk.green(`loaded`)
      );

    for (const file of commandFiles) {
      const command = require(`${process.cwd()}/interactions/${dirs}/${file}`);
      client.commands.set(command.data.name, command);
      commands.push(command.data);
    }
  });

  const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

  (async () => {
    try {
      const embed = new discord.EmbedBuilder()
        .setDescription(`Started refreshing application (/) commands.`)
        .setColor(client."#5865F2");
      interactionLogs.send({
        username: "Bot Logs",
        embeds: [embed],
      });

      await rest.put(Routes.applicationCommands(client.config.discord.id), {
        body: commands,
      });

      const embedFinal = new discord.EmbedBuilder()
        .setDescription(
          `Successfully reloaded ${commands.length} application (/) commands.`
        )
        .setColor(client."#5865F2");
      interactionLogs.send({
        username: "Bot Logs",
        embeds: [embedFinal],
      });
    } catch (error) {
      console.log(error);
    }
  })();
};
