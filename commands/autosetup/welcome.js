const discord = require("discord.js");
const welcomeChannel = require("../../database/models/welcomeChannels");
const welcomeRole = require("../../database/models/joinRole");
const leaveChannel = require("../../database/models/leaveChannels");

module.exports = async (client, interaction, args) => {
  const choice = interaction.options.getString("setup");

  if (choice == "welcomechannel") {
    interaction.guild.channels
      .create({
        name: "Welcome",
        type: discord.ChannelType.GuildText,
      })
      .then((ch) => {
        client.createChannelSetup(welcomeChannel, ch, interaction);
      });
  }

  if (choice == "welcomerole") {
    interaction.guild.roles
      .create({
        name: "Member",
        color: "#5865F2",
      })
      .then((rl) => {
        client.createRoleSetup(welcomeRole, rl, interaction);
      });
  }

  if (choice == "leavechannel") {
    interaction.guild.channels
      .create({
        name: "Bye",
        type: discord.ChannelType.GuildText,
      })
      .then((ch) => {
        client.createChannelSetup(leaveChannel, ch, interaction);
      });
  }
};
