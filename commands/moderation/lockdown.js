const discord = require("discord.js");

module.exports = async (client, interaction, args) => {
  const perms = await client.checkPerms(
    {
      flags: [discord.PermissionsBitField.Flags.ManageChannels],
      perms: [discord.PermissionsBitField.Flags.ManageChannels],
    },
    interaction
  );

  if (perms == false) return;

  interaction.guild.channels.cache.forEach((ch) => {
    if (ch.type == discord.ChannelType.GuildText) {
      ch.permissionOverwrites.edit(interaction.guild.id, {
        SendMessages: false,
      });
    }
  });

  client.succNormal(
    {
      text: "Channels locked successfully",
      type: "editreply",
    },
    interaction
  );
};
