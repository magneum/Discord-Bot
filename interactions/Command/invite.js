const { CommandInteraction, Client } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Get an invite to the bot"),

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */

  run: async (client, interaction, args) => {
    await interaction.deferReply({ fetchReply: true });
    let row = new discord.ActionRowBuilder().addComponents(
      new discord.ButtonBuilder()
        .setLabel("Invite")
        .setURL(client.config.discord.botInvite)
        .setStyle(discord.ButtonStyle.Link),

      new discord.ButtonBuilder()
        .setLabel("Support server")
        .setURL(client.config.discord.serverInvite)
        .setStyle(discord.ButtonStyle.Link)
    );

    client.embed(
      {
        title: `📨・Invite`,
        desc: `Make your server even better with Bot!`,
        image:
          "https://cdn.discordapp.com/attachments/843487478881976381/874694194474668052/Bot_banner_invite.jpg",
        url: client.config.discord.botInvite,
        components: [row],
        type: "editreply",
      },
      interaction
    );
  },
};
