const discord = require("discord.js");

module.exports = async (client, interaction, args) => {
  var list = "";
  client.guilds.cache.forEach((guild) => {
    list += `${guild.name} (${guild.id}) | ${guild.memberCount} members | Owner: ${guild.ownerId}\n`;
  });

  const output = new discord.AttachmentBuilder(Buffer.from(list), {
    name: "servers.txt",
  });
  interaction.editReply({ files: [output] });
};
