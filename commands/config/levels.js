const discord = require("discord.js");

const db = require("../../database/models/functions");

module.exports = async (client, interaction, args) => {
  const perms = await client.checkUserPerms(
    {
      flags: [discord.PermissionsBitField.Flags.ManageMessages],
      perms: [discord.PermissionsBitField.Flags.ManageMessages],
    },
    interaction
  );

  if (perms == false) return;

  const boolean = interaction.options.getBoolean("boolean");

  const data = await db.findOne({ Guild: interaction.guild.id });
  if (data) {
    data.Levels = boolean;
    data.save();
  } else {
    new db({
      Guild: interaction.guild.id,
      Levels: boolean,
    }).save();
  }

  client.succNormal(
    {
      text: `Levels is now **${
        boolean ? "enabled" : "disabled"
      }** in this guild`,
      type: "editreply",
    },
    interaction
  );
};
