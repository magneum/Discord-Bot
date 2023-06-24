const discord = require("discord.js");
const db = require("../../database/models/music");

module.exports = async (client, interaction, args) => {
  const webhookClientLogs = new discord.WebhookClient({
    id: client.weblogs.weblog.id,
    token: client.weblogs.weblog.token,
  });

  let channel = interaction.member.voice
    ? interaction.member.voice.channel
    : null;
  if (!channel)
    return client.errNormal(
      { error: `The channel does not exist!`, type: "editreply" },
      interaction
    );

  client.radioStop(channel);

  var remove = await db.deleteOne({ Guild: interaction.guild.id });

  client.embed(
    {
      title: `📻・Radio stopped`,
      desc: `Radio has stopped successfully \nTo make the bot join do: \`rplay\``,
      fields: [
        {
          name: "👤┆Stopped By",
          value: `${interaction.user} (${interaction.user.tag})`,
          inline: true,
        },
        {
          name: "📺┆Channel",
          value: `${channel} (${channel.name})`,
          inline: true,
        },
      ],
      type: "editreply",
    },
    interaction
  );

  let embed = new discord.EmbedBuilder()
    .setTitle(`📻・Radio stopped`)
    .setDescription(`_______________ \n\nRadio has stopped successfully`)
    .addFields(
      {
        name: "👤┆Stopped By",
        value: `${interaction.user} (${interaction.user.tag})`,
        inline: true,
      },
      {
        name: "📺┆Channel",
        value: `${channel} (${channel.name})`,
        inline: true,
      },
      {
        name: "⚙️┆Guild",
        value: `${interaction.guild.name} (${interaction.guild.id})`,
        inline: true,
      }
    )
    .setColor("#5865F2")
    .setTimestamp();
  webhookClientLogs.send({
    username: "Bot Logs",
    embeds: [embed],
  });
};
