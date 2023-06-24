const discord = require("discord.js");
const logs = require("../../database/models/logChannels");
const boostLogs = require("../../database/models/boostChannels");
const levelLogs = require("../../database/models/levelChannels");

module.exports = async (client, interaction, args) => {
  const choice = interaction.options.getString("setup");

  if (choice == "serverLogs") {
    interaction.guild.channels
      .create({
        name: "server-logs",
        permissionOverwrites: [
          {
            deny: [discord.PermissionsBitField.Flags.ViewChannel],
            id: interaction.guild.id,
          },
        ],
        type: discord.ChannelType.GuildText,
      })
      .then((ch) => {
        client.createChannelSetup(logs, ch, interaction);
      });
  }

  if (choice == "levelLogs") {
    interaction.guild.channels
      .create({
        name: "level-logs",
        type: discord.ChannelType.GuildText,
      })
      .then((ch) => {
        client.createChannelSetup(levelLogs, ch, interaction);
      });
  }

  if (choice == "boostLogs") {
    interaction.guild.channels
      .create({
        name: "boosts",
        type: discord.ChannelType.GuildText,
      })
      .then((ch) => {
        client.createChannelSetup(boostLogs, ch, interaction);
      });
  }
};
