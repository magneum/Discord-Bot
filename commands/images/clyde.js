const { Canvas } = require("canvacord");
const discord = require("discord.js");
module.exports = async (client, interaction, args) => {
  const clydeMessage = interaction.options.getString("text");

  const image = await Canvas.clyde(clydeMessage);

  const attachment = new discord.AttachmentBuilder(image, "clyde.png");

  const embed = client.templateEmbed().setImage("attachment://clyde.png");
  interaction.editReply({ files: [attachment], embeds: [embed] });
};
