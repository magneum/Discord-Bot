const discord = require("discord.js");

const db = require("../../database/models/stats");

module.exports = async (client, interaction, args) => {
  let Emojis = "";
  let EmojiCount = 0;
  let Animated = 0;
  let OverallEmojis = 0;

  function Emoji(id) {
    return client.emojis.cache.get(id).toString();
  }

  interaction.guild.emojis.cache.forEach((emoji) => {
    OverallEmojis++;
    if (emoji.animated) {
      Animated++;
    } else {
      EmojiCount++;
    }
  });

  var channelName = await client.getTemplate(interaction.guild);
  channelName = channelName.replace(`{emoji}`, "😀");
  channelName = channelName.replace(
    `{name}`,
    `Static Emojis: ${EmojiCount || "0"}`
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
          data.StaticEmojis = channel.id;
          data.save();
        } else {
          new db({
            Guild: interaction.guild.id,
            StaticEmojis: channel.id,
          }).save();
        }
      });

      client.succNormal(
        {
          text: `Static emoji count created!`,
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
