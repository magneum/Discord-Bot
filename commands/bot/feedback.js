const discord = require("discord.js");

const webhookClient = new discord.WebhookClient({
  id: "831574783324848188",
  token: "UMFd7fPeeV7sHewjglLuAyM1819qA6AG8_-8VcIcA-bveVODYXy9Hko3pe0sWWgz9oDa",
});

module.exports = async (client, interaction, args) => {
  const feedback = interaction.options.getString("feedback");

  const embed = new discord.EmbedBuilder()
    .setTitle(`📝・New feedback!`)
    .addFields({
      name: "User",
      value: `${interaction.user} (${interaction.user.tag})`,
      inline: true,
    })
    .setDescription(`${feedback}`)
    .setColor("#5865F2");
  webhookClient.send({
    username: "Bot Feedback",
    embeds: [embed],
  });

  client.succNormal(
    {
      text: `Feedback successfully sent to the developers`,
      type: "editreply",
    },
    interaction
  );
};
