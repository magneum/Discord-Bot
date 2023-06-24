const discord = require("discord.js");

const db = require("../../database/models/stats");

module.exports = async (client, interaction, args) => {
  var channelName = await client.getTemplate(interaction.guild);
  channelName = channelName.replace(`{emoji}`, "📢");
  channelName = channelName.replace(
    `{name}`,
    `News Channels: ${
      interaction.guild.channels.cache.filter(
        (channel) => channel.type === discord.ChannelType.GuildAnnouncement
      ).size || 0
    }`
  );

  await interaction.guild.channels
    .create({
      name: channelName,
      type: discord.ChannelType.GuildVoice,
      permissionOverwrites: [
        {
          deny: [discord.PermissionsBitField.Flags.Connect],
          id: interaction.guild.id,
        },
      ],
    })
    .then(async (channel) => {
      db.findOne({ Guild: interaction.guild.id }, async (err, data) => {
        if (data) {
          data.NewsChannels = channel.id;
          data.save();
        } else {
          new db({
            Guild: interaction.guild.id,
            NewsChannels: channel.id,
          }).save();
        }
      });

      client.succNormal(
        {
          text: `News channel count created!`,
          fields: [
            {
              name: `📘┆Channel`,
              value: `${channel}`,
            },
          ],
          type: "editreply",
        },
        interaction
      );
    });
};
