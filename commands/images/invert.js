const discord = require("discord.js");
const pop = require("popcat-wrapper");

module.exports = async (client, interaction, args) => {
  const member = interaction.options.getUser("user");

  const userAvatar = member.displayAvatarURL({
    dynamic: false,
    size: 1024,
    extension: "png",
  });

  const image = await pop.invert(userAvatar);
  let attach = new discord.AttachmentBuilder(image, { name: "invert.png" });
  const embed = client.templateEmbed().setImage("attachment://invert.png");
  interaction.editReply({ files: [attach], embeds: [embed] });
};
