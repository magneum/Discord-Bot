const discord = require("discord.js");

const db = require("../../database/models/stats");

module.exports = async (client, interaction, args) => {
  const members = await interaction.guild.members.fetch();

  var channelName = await client.getTemplate(interaction.guild);
  channelName = channelName.replace(`{emoji}`, "🤖");
  channelName = channelName.replace(
    `{name}`,
    `Bots: ${members.filter((member) => member.user.bot).size || 0}`
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
          data.Bots = channel.id;
          data.save();
        } else {
          new db({
            Guild: interaction.guild.id,
            Bots: channel.id,
          }).save();
        }
      });

      client.succNormal(
        {
          text: `Bots count created!`,
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
