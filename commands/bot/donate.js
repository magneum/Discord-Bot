const discord = require("discord.js");
module.exports = async (client, interaction, args) => {
  let row = new discord.ActionRowBuilder().addComponents(
    new discord.ButtonBuilder()
      .setLabel("Magneum GitHub")
      .setURL("https://github.com/sponsors/Magneum")
      .setStyle(discord.ButtonStyle.Link)
  );

  client.embed(
    {
      title: `${client.user.username}・Donate`,
      desc: "_____ \n\nClick the button below for the sponsor page \n**Pay attention! sponsor is not required**",
      thumbnail: client.user.avatarURL({ dynamic: true }),
      url: "https://github.com/sponsors/Magneum",
      components: [row],
      type: "editreply",
    },
    interaction
  );
};
