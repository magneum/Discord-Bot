const discord = require("discord.js");

const db = require("../../database/models/stickymessages");

module.exports = async (client, interaction, args) => {
  const channel = interaction.options.getChannel("channel");
  const content = interaction.options.getString("message");

  const embed = new discord.EmbedBuilder()
    .setDescription(`${content}`)
    .setColor(client."#5865F2");
  channel.send({ embeds: [embed] }).then((msg) => {
    db.findOne(
      { Guild: interaction.guild.id, Channel: channel.id },
      async (err, data) => {
        if (data) {
          data.Channel = channel.id;
          data.Content = content;
          data.LastMessage = msg.id;
          data.save();
        } else {
          new db({
            Guild: interaction.guild.id,
            Channel: channel.id,
            LastMessage: msg.id,
            Content: content,
          }).save();
        }
      }
    );

    client.succNormal(
      {
        text: "Sticky message created",
        fields: [
          {
            name: `💬┆Message`,
            value: `${content}`,
          },
        ],
        type: "editreply",
      },
      interaction
    );
  });
};
