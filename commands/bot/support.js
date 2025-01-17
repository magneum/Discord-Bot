const discord = require("discord.js");

module.exports = async (client, interaction, args) => {
  let row = new discord.ActionRowBuilder().addComponents(
    new discord.ButtonBuilder()
      .setLabel("Support server")
      .setURL(client.config.discord.serverInvite)
      .setStyle(discord.ButtonStyle.Link)
  );

  client.embed(
    {
      title: `❓・Support`,
      desc: `Make your server even better with Bot!`,
      image:
        "https://cdn.discordapp.com/attachments/843487478881976381/874694194474668052/Bot_banner_invite.jpg",
      url: client.config.discord.serverInvite,
      components: [row],
      type: "editreply",
    },
    interaction
  );
};
