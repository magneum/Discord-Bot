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

  const channel =
    interaction.options.getChannel("channel") || interaction.channel;

  await channel.permissionOverwrites.edit(
    interaction.guild.roles.cache.find((x) => x.name === "@everyone"),
    {
      SendMessages: false,
    }
  );

  client.succNormal(
    {
      text: "Channel locked successfully!",
      fields: [
        {
          name: `📘┆Channel`,
          value: `${channel} (${channel.name})`,
        },
      ],
      type: "editreply",
    },
    interaction
  );
};
