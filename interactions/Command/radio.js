const { CommandInteraction, Client } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const discord = require("discord.js");

const Schema = require("../../database/models/music");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("radio")
    .setDescription("Playing radio in Bot")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("help")
        .setDescription("Get information about the radio category commands")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("play").setDescription("Start the radio")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("stop").setDescription("Stop the radio")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("playing").setDescription("Show what is playing now")
    ),

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */

  run: async (client, interaction, args) => {
    await interaction.deferReply({ fetchReply: true });
    client.checkBotPerms(
      {
        flags: [
          discord.PermissionsBitField.Flags.Connect,
          discord.PermissionsBitField.Flags.Speak,
        ],
        perms: [
          discord.PermissionsBitField.Flags.Connect,
          discord.PermissionsBitField.Flags.Speak,
        ],
      },
      interaction
    );
    if (!interaction.member.voice.channel)
      return client.errNormal(
        {
          error: `You're not in a voice channel!`,
          type: "editreply",
        },
        interaction
      );

    client.loadSubcommands(client, interaction, args);
  },
};
