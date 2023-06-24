const discord = require("discord.js");

const db = require("../../database/models/verify");

module.exports = async (client, interaction, args) => {
  const perms = await client.checkUserPerms(
    {
      flags: [discord.PermissionsBitField.Flags.ManageMessages],
      perms: [discord.PermissionsBitField.Flags.ManageMessages],
    },
    interaction
  );

  if (perms == false) return;

  const boolean = interaction.options.getBoolean("enable");
  const channel = interaction.options.getChannel("channel");
  const role = interaction.options.getRole("role");

  if (boolean == true) {
    const data = await db.findOne({ Guild: interaction.guild.id });
    if (data) {
      data.Channel = channel.id;
      data.Role = role.id;
      data.save();
    } else {
      new db({
        Guild: interaction.guild.id,
        Channel: channel.id,
        Role: role.id,
      }).save();
    }

    client.succNormal(
      {
        text: `Verify panel has been successfully created`,
        fields: [
          {
            name: `📘┆Channel`,
            value: `${channel} (${channel.name})`,
            inline: true,
          },
          {
            name: `📛┆Role`,
            value: `${role} (${role.name})`,
            inline: true,
          },
        ],
        type: "editreply",
      },
      interaction
    );

    const row = new discord.ActionRowBuilder().addComponents(
      new discord.ButtonBuilder()
        .setCustomId("Bot_verify")
        .setEmoji("✅")
        .setStyle(discord.ButtonStyle.Success)
    );

    client.embed(
      {
        title: `${interaction.guild.name}・verify`,
        desc: `Click on the button to verify yourself`,
        components: [row],
      },
      channel
    );
  }
};
